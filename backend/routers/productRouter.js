import express from 'express';
import { createProduct,getProduct ,deleteProduct , updateProduct , getProductInfo} from '../controllers/productController.js';

import { isAdmin } from "../middleware/authMiddleware.js";

const productRouter = express.Router();
productRouter.post('/', isAdmin, createProduct);
productRouter.get('/', getProduct);
productRouter.get('/:productId', getProductInfo);
productRouter.delete('/:productId', isAdmin, deleteProduct);
productRouter.put('/:productId', isAdmin, updateProduct);




export default productRouter;