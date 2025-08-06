import express from 'express';
import { addAProduct, deleteAProduct, getAllProducts, getAProduct, getCategorizedProducts, updateAProduct } from '../controllers/products.controller.js';
import protectedRoute from '../middlewares/protectedRoute.js';
import adminVerify from '../middlewares/adminVerify.js';

const productsRouter = express.Router();

//read
productsRouter.get('/', getAllProducts);
productsRouter.get('/category/:category', getCategorizedProducts);
productsRouter.get('/:id', getAProduct);

//create
productsRouter.post('/', protectedRoute,adminVerify, addAProduct);

//update
productsRouter.put('/:id', protectedRoute, adminVerify, updateAProduct);

//delete
productsRouter.delete('/:id', protectedRoute, adminVerify, deleteAProduct);



export default productsRouter;