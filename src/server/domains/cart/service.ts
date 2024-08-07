import { Types } from 'mongoose'
import { Cart, ICart } from './../../models/cart';

export default class CartService {
    async getCartByUserId(userId: string): Promise<ICart | null> {
        const cartFound = await Cart.findOne({ user: new Types.ObjectId(userId) }).populate('items.product').exec();
        if (cartFound) return cartFound;
        const cart = new Cart({ user: new Types.ObjectId(userId), items: [] });
        return await cart.save();
    };

    async addToCart(userId: string, productId: string, quantity: number): Promise<ICart | null> {
        let cart = await this.getCartByUserId(userId);
        if (!cart) {
            return null;
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: Types.ObjectId.createFromHexString(productId), quantity });
        }
        return await cart.save();
    };

    async removeFromCart(userId: string, productId: string): Promise<ICart | null> {
        let cart = await this.getCartByUserId(userId);
        if (!cart) {
            return null;
        }       
        cart.items = cart.items.filter(item => item.product.id !== productId);
        return await cart.save();
    };

    async clearCart(userId: string): Promise<ICart | null> {
        let cart = await this.getCartByUserId(userId);
        if (!cart) {
            return null;
        }
        cart.items = [];
        return await cart.save();
    };
}

