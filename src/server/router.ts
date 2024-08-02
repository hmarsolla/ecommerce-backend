import express from 'express';

import AuthService from './domains/auth/service';
import AuthRouter from './domains/auth/route';
const authService = new AuthService();

export default function Router() {
    const router = express.Router();

    router.use('/auth', AuthRouter(authService));

    router.get('/', (req, res) => {
		res.send({status: true});
	});

	router.get('/ping', (req, res) => {
		res.send({pong: true});
	});

    return router;
}