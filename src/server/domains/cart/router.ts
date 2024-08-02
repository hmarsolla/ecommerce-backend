import Router from 'express';
import CartService from './service';
import { verifyToken } from '../../middleware/authenticate';

export default function CartRouter(cartService: CartService) {
    const router = Router();

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