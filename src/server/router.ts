import express from 'express';

import AuthService from './domains/auth/service';
import AuthRouter from './domains/auth/route';
const authService = new AuthService();

import ProductService from './domains/products/service';
import ProductRouter from './domains/products/router';
const productService = new ProductService();

export default function Router() {
    const router = express.Router();

    router.use('/auth', AuthRouter(authService));
    router.use('/product', ProductRouter(productService));

    router.get('/', (req, res) => {
		res.send({status: true});
	});

	router.get('/ping', (req, res) => {
		res.send({pong: true});
	});

    return router;
}