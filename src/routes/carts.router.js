import express from 'express';
import { addCarts, deleteCart, getCarts } from '../controllers/carts.controller.js';
import protectedRoute from '../middlewares/protectedRoute.js';

const cartsRouter = express.Router();

cartsRouter.post('/', protectedRoute, addCarts);
cartsRouter.get('/',protectedRoute, getCarts);
cartsRouter.delete('/:id',protectedRoute, deleteCart);


export default cartsRouter;