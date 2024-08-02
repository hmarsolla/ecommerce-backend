import { Product, IProduct } from './../../models/product';

export default class ProductService {

    async getProducts(): Promise<IProduct[]> {
        return await Product.find().exec();
    };

    async getProductById(id: string): Promise<IProduct | null> {
        return await Product.findById(id).exec();
    };

    async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        const product = new Product(productData);
        return await product.save();
    };

    async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        return await Product.findByIdAndUpdate(id, productData, { new: true }).exec();
    };

    async deleteProduct(id: string): Promise<IProduct | null> {
        return await Product.findByIdAndDelete(id).exec();
    };
}

