import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import HTTPServer from '../src/server/index';
import { Application } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../src/server/models/user';

let app: Application;

let mongoServer: MongoMemoryServer;
let userToken: string;
let adminToken: string;
let productId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app  = new HTTPServer().app;

  const hashedPassword = bcrypt.hashSync('apiadm', 8);
  const user = new User({ username: 'admin', password: hashedPassword, roles: ['user', 'admin'] });
  await user.save();

  // Create a user and get the token
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      username: 'testuser',
      password: 'password123'
    });

  // Create a user and get the token
  const userLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      username: 'testuser',
      password: 'password123'
    });
  userToken = userLogin.body.token;

    // Get the admin token
    const adminLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({
      username: 'admin',
      password: 'apiadm'
    });
  adminToken = adminLogin.body.token;

  // Create a product
  const productRes = await request(app)
    .post('/api/v1/products')
    .set('x-access-token', adminToken)
    .send({
      name: 'Test Product',
      description: 'This is a test product',
      price: 100,
      category: 'Test Category',
      stock: 10
    });
  productId = productRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Cart Model', () => {
  it('should create a cart for a user', async () => {
    const res = await request(app)
      .get('/api/v1/cart')
      .set('x-access-token', userToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
  });

  it('should add a product to the cart', async () => {
    const res = await request(app)
      .post('/api/v1/cart/add')
      .set('x-access-token', userToken)
      .send({
        productId: productId,
        quantity: 2
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('should remove a product from the cart', async () => {
    const res = await request(app)
      .delete(`/api/v1/cart/remove/${productId}`)
      .set('x-access-token', userToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.items.length).toEqual(0);
  });

  it('should clear the cart', async () => {
    // Add a product to the cart first
    await request(app)
      .post('/api/v1/cart')
      .set('x-access-token', userToken)
      .send({
        productId: productId,
        quantity: 2
      });

    const res = await request(app)
      .delete('/api/v1/cart/clear')
      .set('x-access-token', userToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.items.length).toEqual(0);
  });
});
