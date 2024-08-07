import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import HTTPServer from '../src/server/index';
import { Application } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../src/server/models/user';

let app: Application;

let mongoServer: MongoMemoryServer;
let adminToken: string;

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
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('roles', ['user']);
  });

  it('should not create a user with the same username', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should authenticate a user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not authenticate a user with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Invalid password');
  });

  it('should create a new admin user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/adm/register')
      .set('x-access-token', adminToken)
      .send({
        username: 'admin2',
        password: 'admin2'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'admin2');
    expect(res.body).toHaveProperty('roles', ['user', 'admin']);
  });

  it('should not create a new admin user without admin role', async () => {
    const userLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/v1/auth/adm/register')
      .set('x-access-token', userLogin.body.token)
      .send({
        username: 'admin2',
        password: 'admin2'
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('message', 'You do not have permission to register another admin');
  });

  it('should authenticate an admin user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'admin2',
        password: 'admin2'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

});
