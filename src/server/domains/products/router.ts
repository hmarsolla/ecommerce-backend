import Router from 'express';
import ProductService from './service';
import { verifyToken } from '../../middleware/authenticate';

export default function ProductRouter(productService: ProductService) {
    const router = Router();

    router.get('/', async (req, res) => {
        try {
            const products = await productService.getProducts();
            res.status(200).send(products);
        } catch (error) {
            res.status(500).send({ message: 'Error retrieving products', error });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const product = await productService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            res.status(200).send(product);
        } catch (error) {
            res.status(500).send({ message: 'Error retrieving product', error });
        }
    });

    router.post('/', verifyToken, async (req, res) => {
        try {
            if (req.body.credential.roles.indexOf('admin') === -1) {
                return res.status(403).send({message: 'You do not have permission to register products'});
            } 
            const product = await productService.createProduct(req.body);
            res.status(201).send(product);
        } catch (error) {
            res.status(500).send({ message: 'Error creating product', error });
        }
    });

    router.put('/:id', verifyToken, async (req, res) => {
        try {
            if (req.body.credential.roles.indexOf('admin') === -1) {
                return res.status(403).send({message: 'You do not have permission to update products'});
            } 
            const product = await productService.updateProduct(req.params.id, req.body);
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            res.status(200).send(product);
        } catch (error) {
            res.status(500).send({ message: 'Error updating product', error });
        }
    });

    router.delete('/:id', verifyToken, async (req, res) => {
        try {
            if (req.body.credential.roles.indexOf('admin') === -1) {
                return res.status(403).send({message: 'You do not have permission to delete products'});
            } 
            const product = await productService.deleteProduct(req.params.id);
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            res.status(204).send({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).send({ message: 'Error deleting product', error });
        }
    });

    return router;
}