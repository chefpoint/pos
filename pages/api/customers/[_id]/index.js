import database from '../../../../services/database';
import Customer from '../../../../models/Customer';

/* * */
/* GET CUSTOMER BY ID */
/* Explanation needed. */
/* * */

export default async function getCustomerByID(req, res) {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    return;
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Database connection error.' });
    return;
  }

  // 2. Try to fetch the correct Customer from the database
  try {
    const foundCustomer = await Customer.findOne({ _id: req.query._id });
    if (!foundCustomer) return await res.status(404).json({ message: `Customer with _id: ${req.query._id} not found.` });
    await res.status(200).json(foundCustomer);
    return;
  } catch (err) {
    console.log(err);
    await res.status(500).json({ message: 'Cannot fetch this customer.' });
    return;
  }
}
