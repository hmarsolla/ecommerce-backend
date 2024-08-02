import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String },
    stock: { type: Number, required: true },
}, {
    timestamps: true
});

productSchema.index({ name: 1 }, { unique: true });

export const Product = mongoose.model<IProduct>('Product', productSchema);