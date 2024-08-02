import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './user';
import { IProduct } from './product';

export interface ICartItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart extends Document {
  user: Types.ObjectId | IUser;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new Schema<ICart>({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema]
}, {
  timestamps: true
});

cartSchema.index({ user: 1 }, { unique: true });

export const Cart = model<ICart>('Cart', cartSchema);