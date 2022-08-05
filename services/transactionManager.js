/* * */
/* TRANSACTION MANAGER */
/* Responsible for creating the Transaction object. */
/* * */

async function create(appstate, order) {
  //

  // The TRANSACTION
  // Transactions are immutable. This means that they cannot be changed
  // or updated later (with a few exceptions). It is important that
  // the details for each component are saved in addition to the respective
  // ObjectID that links to the original object. Even if the object is deleted
  // later, the details are still saved in the Transaction for historical purposes.
  // For example, if a Device or Customer are deleted later, it is still possible
  // to see the original details as they were at the time of closing the Transaction.

  // 1. Build the Transaction object
  // This are all the components for each Transaction.
  const transaction = {
    device: null,
    location: null,
    user: null,
    layout: null,
    items: [],
    discounts: [],
    payment: null,
    customer: null,
    checking_account: null,
    invoice: null,
  };

  // 1.1. Device
  // In which device was this transaction closed.
  transaction.device = {
    _id: appstate.device._id,
    title: appstate.device.title,
  };

  // 1.2. Location
  // Which location is this transaction associated with.
  transaction.location = {
    _id: appstate.device.location._id,
    title: appstate.device.location.title,
  };

  // 1.3. User
  // Which user closed this transaction.
  transaction.user = {
    _id: appstate.currentUser._id,
    name: appstate.currentUser.name,
    role: appstate.currentUser.role,
  };

  // 1.4. Layout
  // What was the layout used at the moment.
  transaction.layout = {
    _id: appstate.device.layout._id,
    title: appstate.device.layout.title,
  };

  // 1.5. Items
  // The list of products transacted.
  for (const item of order.items) {
    transaction.items.push({
      product_id: item.product._id,
      product_image: item.product.image,
      product_title: item.product.title,
      variation_id: item.variation._id,
      variation_title: item.variation.title,
      qty: item.qty,
      price: item.variation.price,
      tax_id: item.variation.tax_id,
      tax_percentage: getTaxPercentageFromTaxId(item.variation.tax_id),
      line_base: calculateLineItemBaseAmount(item.qty, item.variation.price, item.variation.tax_id),
      line_tax: calculateLineItemTaxAmount(item.qty, item.variation.price, item.variation.tax_id),
      line_total: calculateLineItemTotalAmount(item.qty, item.variation.price),
    });
  }

  // 1.6. Discounts
  // The discounts applied in this transaction.
  for (const discount of order.discounts) {
    transaction.discounts.push({
      _id: discount._id,
      title: discount.title,
      subtitle: discount.subtitle,
      description: discount.description,
      amount: discount.amount,
    });
  }

  // 1.7. Customer
  // The customer associated with this transaction.
  if (order.hasCustomer) {
    transaction.customer = {
      _id: order.customer._id,
      first_name: order.customer.first_name,
      last_name: order.customer.last_name,
      reference: order.customer.reference,
      tax_region: order.customer.tax_region,
      tax_number: order.customer.tax_number,
      contact_email: order.customer.contact_email,
      send_invoices: order.customer.send_invoices,
    };
  }

  // 1.8. Payment
  // How was this transaction paid and the amounts involved.
  transaction.payment = {
    method_value: order.payment.method_value,
    method_label: order.payment.method_label,
    amount_subtotal: order.totals.subtotal.toFixed(2),
    amount_discounts: order.totals.discounts.toFixed(2),
    amount_total: order.totals.total.toFixed(2),
  };

  // 1.8.1. Payment › Specific Properties
  // Based on the payment method used, save properties
  // depending on the Payment Method used.
  switch (transaction.payment.method_value) {
    //
    // Payment › Card or Cash
    case 'card':
    case 'cash':
      // For Card or Cash payments,
      // transactions are paid and should be invoiced immediately.
      transaction.payment.is_paid = true;
      transaction.payment.should_invoice = true;
      break;
    //
    // Payment › Free
    case 'free':
      // For Free transactions, items are considered paid
      // but they should not produce an invoice.
      transaction.payment.is_paid = true;
      transaction.payment.should_invoice = false;
      break;
    //
    // Payment › Checking Account
    case 'checking_account':
      // Transactions with the 'checking_account' method
      // are not paid immediately, but at a later time
      // all at once. Transactions with this payment method
      // share one single invoice and use the Tax details
      // of the associated CheckingAccount object.
      transaction.payment.is_paid = false;
      transaction.payment.should_invoice = false;
      // Save the details of the corresponding Checking Account.
      transaction.checking_account = {
        _id: order.payment.checking_account._id,
        title: order.payment.checking_account.title,
        client_name: order.payment.checking_account.client_name,
        tax_region: order.payment.checking_account.tax_region,
        tax_number: order.payment.checking_account.tax_number,
      };
      break;
    //
    // Fail because transaction is malformed
    default:
      throw new Error('Transaction has no valid payment.');
  }

  // 2. Now that the Transaction object is built,
  // send it to the API for processing and storage.
  try {
    const res = await fetch('/api/transactions/create', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    const parsedResponse = await res.json();
    if (!res.ok) throw new Error(parsedResponse.message);
    else return parsedResponse;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  //
}

const transactionManager = {
  create,
};

export default transactionManager;

function getTaxPercentageFromTaxId(taxId) {
  switch (taxId) {
    // Taxa Normal = 23%
    case 'NOR':
      return 0.23;
    // Taxa Intermédia = 13% (Default)
    default:
    case 'INT':
      return 0.13;
    // Taxa Reduzida = 6%
    case 'RED':
      return 0.06;
  }
}

function calculateLineItemBaseAmount(qty, unitPrice, taxId) {
  const taxPercentage = getTaxPercentageFromTaxId(taxId);
  const baseAmount = (qty * unitPrice) / (1 + taxPercentage);
  return baseAmount.toFixed(2);
}

function calculateLineItemTaxAmount(qty, unitPrice, taxId) {
  const taxPercentage = getTaxPercentageFromTaxId(taxId);
  const taxAmount = qty * unitPrice * taxPercentage;
  return taxAmount.toFixed(2);
}

function calculateLineItemTotalAmount(qty, unitPrice) {
  const totalAmount = qty * unitPrice;
  return totalAmount.toFixed(2);
}
