import database from '../../../services/database';
import Device from '../../../models/Device';
import Location from '../../../models/Location';
import User from '../../../models/User';
import Layout from '../../../models/Layout';
import Product from '../../../models/Product';
import Discount from '../../../models/Discount';
import CheckingAccount from '../../../models/CheckingAccount';

export default async function devices(req, res) {
  //

  // 0. Refuse request if not GET
  if (req.method != 'GET') {
    await res.setHeader('Allow', ['GET']);
    await res.status(405).json({ isError: true, message: `Method ${req.method} Not Allowed` });
    return;
  }

  // 1. Try to connect to the database
  try {
    await database.connect();
  } catch (err) {
    console.log(err);
    await res.status(500).json({ isError: true, message: 'Database connection error.' });
    return;
  }

  // 2. Try to fetch the device from the database
  try {
    const foundDevices = await Device.find({ code: req.query.code })
      .populate({ path: 'location' })
      .populate({ path: 'users' })
      .populate({ path: 'layout', populate: { path: 'folders.slots.product' } })
      .populate({ path: 'discounts' })
      .populate({ path: 'checking_accounts' });
    // Return the first found device to the client
    if (foundDevices.length) await res.status(200).json(foundDevices[0]);
    else throw new Error('No devices found with the requested code.');
    //
  } catch (err) {
    console.log(err);
    await res.status(404).json({ isError: true, message: 'Invalid Device Code.' });
    return;
  }
}
