import { Router } from 'express';
import ProductsController from '../controllers/productsController';

const router = Router();
const productsController = new ProductsController();

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

export default router;