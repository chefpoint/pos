import database from '../../../services/database';
import Customer from '../../../models/Customer';

/* * */
/* GET ALL CUSTOMERS */
/* Explanation needed. */
/* * */

export default async function getAllCustomers(req, res) {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    return await res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Database connection error.' });
  }

  // 2. Try to fetch all customers from the database
  try {
    const allCustomers = await Customer.find({});
    return await res.status(200).send(allCustomers);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch customers.' });
  }
}
