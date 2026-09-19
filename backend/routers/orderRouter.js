import express from 'express';
import { createOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { isUser, isAdmin } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

orderRouter.post('/', isUser, createOrder);
orderRouter.get('/', isUser, isAdmin, getAllOrders);
orderRouter.put('/:orderId/status', isUser, isAdmin, updateOrderStatus);

export default orderRouter;