import Router from 'express';
import CartService from './service';
import { verifyToken } from '../../middleware/authenticate';

export default function CartRouter(cartService: CartService) {
    const router = Router();

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     CartItem:
	 *       type: object
	 *       required:
	 *         - product
	 *         - quantity
	 *       properties:
	 *         id:
	 *           type: string
	 *           description: The auto-generated id of the cart item
	 *         product:
	 *           type: string
	 *           description: The product's id
	 *         quantity:
	 *           type: integer
	 *           description: The product's quantity
	 *       example:
	 *         id: 66b3dce5816c03a15efc472e
	 *         product: 66b3d99f553f44bae70a8d1e
	 *         quantity: 2
     * 
	 *     Cart:
	 *       type: object
	 *       required:
	 *         - user
	 *       properties:
	 *         id:
	 *           type: string
	 *           description: The auto-generated id of the cart
	 *         user:
	 *           type: string
	 *           description: The cart's owner id
     *         items:
     *           type: array
     *           items:
     *             $ref: '#/components/schemas/CartItem'
	 *       example:
	 *         id: 66b3dc44523b23050ad930b3
	 *         user: 66b3aa46b7b26d5e92947fa6
	 *         items: [{id: 66b3dce5816c03a15efc472e,
	 *         product: 66b3d99f553f44bae70a8d1e,
	 *         quantity: 2,}]
	 */

	/**
	 * @swagger
	 * /cart/:
	 *   get:
	 *     summary: Get current user's cart
	 *     tags: [Cart]
	 *     parameters:
	 *       - in: header
	 *         name: x-access-token
	 *         schema:
	 *           type: string
	 *         required: true
	 *     responses:
	 *       200:
	 *         description: The current user's cart
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Cart'
     *       404:
     *         description: Cart not found
	 *       500:
	 *         description: Internal Server Error
	 */

    router.get('/', verifyToken, async (req, res) => {
        try {
            const cart = await cartService.getCartByUserId(req.body.credential.id);
            if (!cart) {
                return res.status(404).send({ message: 'Cart not found' });
            }
            res.status(200).send(cart);
        } catch (error) {
            res.status(500).send({ message: 'Error retrieving cart', error });
        }
    });

    /**
	 * @swagger
	 * /cart/add:
	 *   post:
	 *     summary: Add a product to current user's cart
	 *     tags: [Cart]
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
	 *               productId:
	 *                 type: string
	 *                 description: The products's id
	 *               quantity:
	 *                 type: string
	 *                 description: The product's quantity
	 *     responses:
	 *       200:
	 *         description: The current user's cart
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Cart'
     *       404:
     *         description: Cart not found
	 *       500:
	 *         description: Internal Server Error
	 */

    router.post('/add', verifyToken, async (req, res) => {
        const { productId, quantity } = req.body;
        try {
            const cart = await cartService.addToCart(req.body.credential.id, productId, quantity);
            if (!cart) {
                return res.status(404).send({ message: 'Cart not found' });
            }
            res.status(200).send(cart);
        } catch (error) {
            res.status(500).send({ message: 'Error adding item to cart', error });
        }
    });

	/**
	 * @swagger
	 * /cart/{productId}:
	 *   delete:
	 *     summary: Remove an item from the cart
	 *     tags: [Cart]
	 *     parameters:
	 *       - in: header
	 *         name: x-access-token
	 *         schema:
	 *           type: string
	 *         required: true
     *       - in: path
     *         name: productId
     *         schema:
     *           type: integer
     *         required: true
	 *     responses:
	 *       200:
	 *         description: The updated current user's cart 
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Cart'
     *       404:
     *         description: Cart not found
	 *       500:
	 *         description: Internal Server Error
	 */

    router.delete('/remove/:productId', verifyToken, async (req, res) => {
        const { productId } = req.params;
        try {
            const cart = await cartService.removeFromCart(req.body.credential.id, productId);
            if (!cart) {
                return res.status(404).send({ message: 'Cart not found' });
            }
            res.status(200).send(cart);
        } catch (error) {
            res.status(500).send({ message: 'Error removing item from cart', error });
        }
    });

	/**
	 * @swagger
	 * /cart/clear:
	 *   delete:
	 *     summary: Remove an item from the cart
	 *     tags: [Cart]
	 *     parameters:
	 *       - in: header
	 *         name: x-access-token
	 *         schema:
	 *           type: string
	 *         required: true
	 *     responses:
	 *       200:
	 *         description: The cleared current user's cart 
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Cart'
     *       404:
     *         description: Cart not found
	 *       500:
	 *         description: Internal Server Error
	 */

    router.delete('/clear', verifyToken, async (req, res) => {
        try {
            const cart = await cartService.clearCart(req.body.credential.id);
            if (!cart) {
              return res.status(404).send({ message: 'Cart not found' });
            }
            res.status(200).send(cart);
          } catch (error) {
            res.status(500).send({ message: 'Error clearing cart', error });
          }
    });

    return router;
}