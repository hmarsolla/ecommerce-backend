import Router from 'express';
import HTTPError from '../../helpers/httpError';
import AuthService from './service';
import { verifyToken } from '../../middleware/authenticate';

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

	router.post('/adm/register', verifyToken, async (req, res, next) => {
		try {
			if (req.body.credential.roles.indexOf('admin') === -1) {
                return res.status(403).send({message: 'You do not have permission to register another admin'});
            } 
			const username = req.body.username;
			const password = req.body.password;
			const roles = ['user', 'admin'];

			if (!username || !password) throw new HTTPError(400, 'The username and/or password parameter must be a string');
	
			const userCreated = await authService.createUser(username, password, roles);
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