import express from 'express';
import { searchProducts } from '../controllers/search.controller.js';

const searchRouter = express.Router();

searchRouter.get('/', searchProducts);

export default searchRouter;