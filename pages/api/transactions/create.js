import database from '../../../services/database';
import Transaction from '../../../models/Transaction';
import Device from '../../../models/Device';
import CheckingAccount from '../../../models/CheckingAccount';

export default async function createTransaction(req, res) {
  //

  // 0. Refuse request if not POST
  if (req.method != 'POST') {
    await res.setHeader('Allow', ['POST']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Parse request body into JSON
  try {
    req.body = JSON.parse(req.body);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'JSON parse error.' });
  }

  // 2. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 3. Verify validity of Device Code
  try {
    const foundDevices = await Device.find({ _id: req.body?.device?._id });
    if (!foundDevices.length) throw new Error('The provided Device Code is invalid.');
  } catch (err) {
    console.log(err);
    return await res.status(401).json({ message: err });
  }

  // 4. Update stock in Apicbase
  // later...

  // 5. If the Transaction was paid,
  // then create an invoice in Vendus.
  if (req.body.payment?.is_paid && req.body.payment?.should_invoice) {
    try {
      // 5.1. Format transaction into an invoice
      const preparedInvoice = prepareInvoice(req.body);
      // 5.2. Perform the HTTP request
      const response = await fetch('https://www.vendus.pt/ws/v1.2/documents', {
        method: 'POST',
        body: JSON.stringify(preparedInvoice),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + Buffer.from(process.env.VENDUS_API_KEY).toString('base64'),
        },
      });
      // 5.3. Parse the response into JSON
      const invoice = await response.json();
      // 5.4. Check status of response
      if (response.status != 201)
        throw new Error((invoice.errors && invoice.errors[0]?.message) || invoice.ERROR || 'Failed at Step 5'); // This is how Vendus API sends errors
      // 5.5. If response is valid, update request data with new details
      req.body.invoice = {
        invoice_id: invoice.id,
        type: invoice.type,
        number: invoice.number,
        date: invoice.date,
        system_time: invoice.system_time,
        local_time: invoice.local_time,
        amount_gross: invoice.amount_gross,
        amount_net: invoice.amount_net,
        hash: invoice.hash,
      };
    } catch (err) {
      console.log(err);
      return await res.status(500).json({ message: err.message });
    }
  }

  // 6. Try to save a new document with req.body
  // and send the saved transaction back to the client.
  try {
    const createdTransaction = await Transaction(req.body).save();
    await res.status(201).json(createdTransaction);
    console.log('New Transaction Created:', createdTransaction);
    return;
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error creating Transaction.' });
  }

  // FINISH
}

/* * */
/* This function returns a new invoice object from the provided transaction, */
/* formated according to the Vendus API requirements. */
const prepareInvoice = (transaction) => {
  const invoice = {
    // Get Environment Variable to decide if created invoices are valid or not.
    // 'tests': Only fiscally invalid invoices will be created.
    // 'normal': Create valid invoices.
    mode: process.env.VENDUS_WORKMODE || 'tests',
    // To which store should this invoice be attributed.
    register_id: process.env.VENDUS_REGISTER_ID,
    // The type of document to create.
    type: 'FT',
    // Prepare items for invoice.
    items: [],
    // Setup invoice discounts
    discount_amount: transaction.payment.amount_discounts,
    // Set payment method so a receipt is issued
    payments: [{ id: process.env.VENDUS_PAYMENT_ID }],
  };

  // Prepare each item according to Vendus API
  for (const item of transaction.items) {
    // Skip if item has no price
    if (item.price > 0) {
      invoice.items.push({
        reference: item.variation_id,
        title: item.product_title + ' - ' + item.variation_title,
        qty: item.qty,
        gross_price: item.price,
        tax_id: item.tax_id,
      });
    }
  }

  // If transaction has associated Tax Details, add it to invoice
  if (transaction.customer?.tax_number) {
    invoice.client = {
      name: `${transaction.customer.first_name || ''} ${transaction.customer.last_name || ''}`,
      address: '-',
      country: transaction.customer.tax_region,
      fiscal_id: transaction.customer.tax_number,
      email: transaction.customer.contact_email,
      send_email: transaction.customer.send_invoices ? 'yes' : 'no',
    };
  }

  return invoice;
};
