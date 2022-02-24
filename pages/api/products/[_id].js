import _ from 'lodash';
import database from '../../../services/database';
import Product from '../../../models/Product';

export default async function products(req, res) {
  //
  // Connect to the Database
  database.connect();

  switch (req.method) {
    //
    case 'GET':
      let getResult;
      if (req.query._id == '*') getResult = await getAllProducts();
      else getResult = await getProductWith(req.query._id);
      await res.status(getResult.status).json(getResult.data);
      break;
    //
    case 'PUT':
      const putResult = await putProductWith(req.query._id, req.query);
      res.status(putResult.status).json(putResult.data);
      break;
    //
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}

/* * */
/* REST: GET */
async function getAllProducts() {
  // Fetch all documents from the database and sort them
  const allProducts = await Product.find({});
  return { status: 200, data: allProducts };
}

/* * */
/* REST: GET */
async function getProductWith(_id) {
  // Fetch documents from the database that match the requested '_id'
  const foundProducts = await Product.find({ _id: _id });

  if (foundProducts.length > 0) {
    // If document with _id exists
    return { status: 200, data: foundProducts[0] };
  } else {
    // If document with _id does not exist
    return { status: 404, data: { message: `Product with _id: ${_id} not found.` } };
  }
}

/* * */
/* REST: PUT */
async function putProductWith(_id, query) {
  // Update document that matches the requested '_id'
  const updatedProduct = await Product.findOneAndUpdate({ _id: _id }, query, {
    new: true, // Return the updated document
    upsert: true, // If no document is found, create it
  });

  if (updatedProduct.length > 0) {
    // Document was updated or created
    return { status: 200, data: updatedProduct };
  } else {
    // An Error Occurred
    return { status: 500, data: { message: 'An Error Occurred.' } };
  }
}
