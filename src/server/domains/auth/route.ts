import Router from 'express';
import HTTPError from '../../helpers/httpError';
import AuthService from './service';
import { verifyToken } from '../../middleware/authenticate';

export default function AuthRouter(authService: AuthService) {
	const router = Router();

	/**
	 * @swagger
	 * components:
	 *   schemas:
	 *     User:
	 *       type: object
	 *       required:
	 *         - username
	 *         - password
	 *       properties:
	 *         id:
	 *           type: string
	 *           description: The auto-generated id of the user
	 *         username:
	 *           type: string
	 *           description: The user's username
	 *         roles:
	 *           type: string[]
	 *           description: The user's roles
	 *       example:
	 *         id: 66b3aa46b7b26d5e92947fa6
	 *         username: johndoe
	 *         roles: ['user', 'admin']
	 */

	/**
	 * @swagger
	 * /auth/register/:
	 *   post:
	 *     summary: Register a new User
	 *     tags: [User]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               username:
	 *                 type: string
	 *                 description: The username of the user
	 *               password:
	 *                 type: string
	 *                 description: The password of the user
	 *     responses:
	 *       201:
	 *         description: The new registered user
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 *       500:
	 *         description: Internal Server Error
	 */

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

	/**
	 * @swagger
	 * /auth/adm/register/:
	 *   post:
	 *     summary: Register a new Admin User
	 *     tags: [User]
	 *     parameters:
	 *       - in: header
	 *         name: x-access-token
	 *         schema:
	 *           type: string
	 *         required: true
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               username:
	 *                 type: string
	 *                 description: The username of the user
	 *               password:
	 *                 type: string
	 *                 description: The password of the user
	 *     responses:
	 *       201:
	 *         description: The new registered user
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/User'
	 *       500:
	 *         description: Internal Server Error
	 */

	router.post('/adm/register', verifyToken, async (req, res, next) => {
		try {
			if (req.body.credential.roles.indexOf('admin') === -1) {
				return res.status(403).send({ message: 'You do not have permission to register another admin' });
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

	/**
	 * @swagger
	 * /auth/login/:
	 *   post:
	 *     summary: Authenticates a user
	 *     tags: [User]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               username:
	 *                 type: string
	 *                 description: The username of the user
	 *               password:
	 *                 type: string
	 *                 description: The password of the user
	 *     responses:
	 *       200:
	 *         description: The new registered user
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 token:
	 *                   type: string
	 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjNjNDRkYWFiODBiYzFmNGIzNTkwZiIsInJvbGVzIjpbInVzZXIiXSwidXNlcm5hbWUiOiJoZWl0b3IyIiwiaWF0IjoxNzIzMDU3MjM4LCJleHAiOjE3MjMxNDM2Mzh9.Dig87CHzxvnPh06kUbxGJQAGVAl0xYiCpS7fqzBCcPo
	 *       400:
	 *         description: The username and/or password parameter must be a string
	 *       500:
	 *         description: Internal Server Error
	 */


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