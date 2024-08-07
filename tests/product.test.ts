import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import HTTPServer from '../src/server/index';
import { Product } from '../src/server/models/product';
import { Application } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../src/server/models/user';

let app: Application;

let mongoServer: MongoMemoryServer;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = new HTTPServer().app

  const hashedPassword = bcrypt.hashSync('apiadm', 8);
  const user = new User({ username: 'admin', password: hashedPassword, roles: ['user', 'admin'] });
  await user.save();

  // Get admin token
  const adminLogin = await request(app)
  .post('/api/v1/auth/login')
  .send({
    username: 'admin',
    password: 'apiadm'
  });
  adminToken = adminLogin.body.token;

  const userRegister = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
  });

  // Get user token
  const userLogin = await request(app)
  .post('/api/v1/auth/login')
  .send({
    username: 'testuser',
    password: 'password123'
  });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Product Model', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('x-access-token', adminToken)
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

  it('should not create a new product without admin role', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('x-access-token', userToken)
      .send({
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        category: 'Test Category',
        stock: 10
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('message', 'You do not have permission to register products');
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
      .set('x-access-token', adminToken)
      .send({
        name: 'Updated Product',
        price: 250
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Product');
    expect(res.body).toHaveProperty('price', 250);
  });

  it('should not update a product by id without admin role', async () => {
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
      .set('x-access-token', userToken)
      .send({
        name: 'Updated Product',
        price: 250
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('message', 'You do not have permission to update products');
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

    const res = await request(app).delete(`/api/v1/products/${newProduct._id}`).set('x-access-token', adminToken).send();

    expect(res.statusCode).toEqual(204);
  });

  it('should not delete a product by id without admin role', async () => {
    const newProduct = new Product({
      name: 'Delete Test Product',
      description: 'This product will be deleted',
      price: 300,
      category: 'Delete Test Category',
      stock: 40
    });
    await newProduct.save();

    const res = await request(app).delete(`/api/v1/products/${newProduct._id}`).set('x-access-token', userToken).send();

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('message', 'You do not have permission to delete products');
  });
});
