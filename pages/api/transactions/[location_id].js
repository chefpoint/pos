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

  // 2. Try to fetch all matching transactions from the database
  try {
    // Match the whole day for requested dates
    const startTimestamp = new Date(req.query.dateStart);
    startTimestamp.setHours(0, 0, 0, 0);
    const endTimestamp = new Date(req.query.dateEnd);
    endTimestamp.setHours(23, 59, 59, 999);
    // Find the transactions
    const allTransactions = await Transaction.find({
      'location._id': req.query.location_id, // Find only for this location_id
      createdAt: { $gte: startTimestamp, $lt: endTimestamp }, // Find only for this date range
    });
    return await res.status(200).send(allTransactions);
  } catch (err) {
    console.log(err);
    return await res.status(500).json({ message: 'Cannot fetch transactions.' });
  }
}
