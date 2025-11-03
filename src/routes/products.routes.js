import express from 'express';
import { 
    getProducts, 
    getProduct, 
    createNewProduct,
    updateProduct,
    deleteProduct
    } from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createNewProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
