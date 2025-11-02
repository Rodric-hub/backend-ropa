import express from 'express';
import { createOrder } from '../controllers/orders.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.post('/', verifyToken, createOrder);
export default router;
