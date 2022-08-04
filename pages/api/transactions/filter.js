import database from '../../../services/database';
import Transaction from '../../../models/Transaction';

/* * */
/* GET ALL TRANSACTIONS */
/* Explanation needed. */
/* * */

export default async function listTransactions(req, res) {
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

  // 2.1. Define a global variable to hold the query
  const filterQuery = {};

  // 2.2. Parse filter queries from request
  try {
    // 2.2.1. If has 'LOCATION_ID'
    if (req.query.location_id) {
      // Save the filter
      filterQuery['location._id'] = req.query.location_id;
    }
    // 2.2.2. If has 'DATE_RANGE'
    if (req.query.date_start && req.query.date_end) {
      // Set the start date to be the begining of the day
      const dateStart = new Date(req.query.date_start);
      dateStart.setHours(0, 0, 0, 0);
      // Set the end date to be the end of the day
      const dateEnd = new Date(req.query.date_end);
      dateEnd.setHours(23, 59, 59, 999);
      // Save the filter
      filterQuery['createdAt'] = { $gte: dateStart, $lt: dateEnd };
    }
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Error parsing filter query.' });
  }

  // 2. Try to fetch all matching transactions from the database
  try {
    // Find the transactions
    const allTransactions = await Transaction.find(filterQuery);
    return await res.status(200).send(allTransactions);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch transactions.' });
  }
}
