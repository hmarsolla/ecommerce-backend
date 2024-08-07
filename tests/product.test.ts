import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import HTTPServer from '../src/server/index';
import { Product } from '../src/server/models/product';

const app = new HTTPServer().app;

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Product Model', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        category: 'Test Category',
        stock: 10
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'Test Product');
  });

  it('should get a list of products', async () => {
    const res = await request(app).get('/api/v1/products');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a product by id', async () => {
    const newProduct = new Product({
      name: 'Another Test Product',
      description: 'This is another test product',
      price: 150,
      category: 'Another Test Category',
      stock: 20
    });
    await newProduct.save();

    const res = await request(app).get(`/api/v1/products/${newProduct._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'Another Test Product');
  });

  it('should update a product by id', async () => {
    const newProduct = new Product({
      name: 'Update Test Product',
      description: 'This product will be updated',
      price: 200,
      category: 'Update Test Category',
      stock: 30
    });
    await newProduct.save();

    const res = await request(app)
      .put(`/api/v1/products/${newProduct._id}`)
      .send({
        name: 'Updated Product',
        price: 250
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Product');
    expect(res.body).toHaveProperty('price', 250);
  });

  it('should delete a product by id', async () => {
    const newProduct = new Product({
      name: 'Delete Test Product',
      description: 'This product will be deleted',
      price: 300,
      category: 'Delete Test Category',
      stock: 40
    });
    await newProduct.save();

    const res = await request(app).delete(`/api/v1/products/${newProduct._id}`);

    expect(res.statusCode).toEqual(204);
  });
});
