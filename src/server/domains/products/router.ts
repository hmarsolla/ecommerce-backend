import Router from 'express';
import ProductService from './service';
import { verifyToken } from '../../middleware/authenticate';

export default function ProductRouter(productService: ProductService) {
    const router = Router();

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     Product:
	 *       type: object
	 *       required:
	 *         - name
	 *         - description
     *         - price
     *         - category
     *         - stock
	 *       properties:
	 *         id:
	 *           type: string
	 *           description: The auto-generated id of the product
	 *         name:
	 *           type: string
	 *           description: The products's name
	 *         description:
	 *           type: string
	 *           description: The product's description
     *         price:
     *           type: integer
     *           description: The product's price
     *         category:
     *           type: string
     *           description: The product's category
     *         imageUrl:
     *           type: string
     *           description: The image of the product
     *         stock:
     *           type: integer
     *           description: The current amount of the product that's in stock.
	 *       example:
	 *         id: 66b3d99f553f44bae70a8d1e
	 *         name: 'Shampoo'
	 *         description: 'This is the best shampoo'
     *         price: 100
     *         imageUrl: https://img.url.com
     *         category: 'hygiene'
     *         stock: 10
	 */

	/**
	 * @swagger
	 * /products/:
	 *   get:
	 *     summary: List all products
	 *     tags: [Products]
	 *     responses:
	 *       200:
	 *         description: The list of all products
	 *         content:
	 *           application/json:
	 *             schema:
     *               type: array
     *               items:
	 *                 $ref: '#/components/schemas/Product'
	 *       500:
	 *         description: Internal Server Error
	 */

    router.get('/', async (req, res) => {
        try {
            const products = await productService.getProducts();
            res.status(200).send(products);
        } catch (error) {
            res.status(500).send({ message: 'Error retrieving products', error });
        }
    });

    /**
	 * @swagger
	 * /products/{id}:
	 *   get:
	 *     summary: List a specific product
	 *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
	 *     responses:
	 *       200:
	 *         description: The product identified by the ID parameter
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Product'
     *       404:
     *         description: Product not found
	 *       500:
	 *         description: Internal Server Error
	 */

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

    /**
	 * @swagger
	 * /products/:
	 *   post:
	 *     summary: Creates a new product
	 *     tags: [Products]
	 *     parameters:
	 *       - in: header
	 *         name: x-access-token
	 *         schema:
	 *           type: string
	 *         required: true
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 description: The products's name
	 *               description:
	 *                 type: string
	 *                 description: The product's description
     *               price:
     *                 type: integer
     *                 description: The product's price
     *               category:
     *                 type: string
     *                 description: The product's category
     *               imageUrl:
     *                 type: string
     *                 description: The image of the product
     *               stock:
     *                 type: integer
     *                 description: The current amount of the product that's in stock.
	 *     responses:
	 *       201:
	 *         description: The new product that has been registered
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Product'
     *       403:
     *         description: You do not have permission to register products
	 *       500:
	 *         description: Internal Server Error
	 */

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

    /**
	 * @swagger
	 * /products/{id}:
	 *   put:
	 *     summary: Updates a product's properties
	 *     tags: [Products]
	 *     parameters:
	 *       - in: header
	 *         name: x-access-token
	 *         schema:
	 *           type: string
	 *         required: true
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               name:
	 *                 type: string
	 *                 description: The products's name
	 *               description:
	 *                 type: string
	 *                 description: The product's description
     *               price:
     *                 type: integer
     *                 description: The product's price
     *               category:
     *                 type: string
     *                 description: The product's category
     *               imageUrl:
     *                 type: string
     *                 description: The image of the product
     *               stock:
     *                 type: integer
     *                 description: The current amount of the product that's in stock.
	 *     responses:
	 *       201:
	 *         description: The new product that has been registered
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Product'
     *       403:
     *         description: You do not have permission to update products
     *       404:
     *         description: Product not found
	 *       500:
	 *         description: Internal Server Error
	 */

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

    /**
	 * @swagger
	 * /products/{id}:
	 *   delete:
	 *     summary: Deletes a specific product
	 *     tags: [Products]
	 *     parameters:
	 *       - in: header
	 *         name: x-access-token
	 *         schema:
	 *           type: string
	 *         required: true
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
	 *     responses:
	 *       204:
	 *         description: Product deleted successfully
	 *       403:
     *         You do not have permission to delete products
     *       404:
     *         description: Product not found
	 *       500:
	 *         description: Internal Server Error
	 */

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