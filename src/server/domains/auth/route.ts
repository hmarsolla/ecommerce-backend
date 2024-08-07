import Router from 'express';
import HTTPError from '../../helpers/httpError';
import AuthService from './service';

export default function AuthRouter(authService: AuthService) {
    const router = Router();

    router.post('/register', async (req, res, next) => {
		try {
			const username = req.body.username;
			const password = req.body.password;
	
			if (!username || !password) throw new HTTPError(400, 'The username and/or password parameter must be a string');
	
			const userCreated = await authService.createUser(username, password);
			res.status(201).json(userCreated.project());				
		} catch (error) {
			next(error);
		}
	});

    router.post('/login', async (req, res, next) => {
		try {
			const username = req.body.username;
			const password = req.body.password;
	
			if (!username || !password) throw new HTTPError(400, 'The username and/or password parameter must be a string');
	
			const result = await authService.login(username, password);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	});

    return router;
}