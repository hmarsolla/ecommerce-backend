import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import config from '../../../config';
import HTTPError from './../../helpers/httpError';
import { IUser, User } from '../../models/user';

export default class AuthService {

    async createAdmin(adminUsername: string, adminPassword: string) {
        await this.createUser(adminUsername, adminPassword, ['user', 'admin']);
    }

    async createUser(username: string, password: string, roles: string[] = ['user']): Promise<IUser> {
        const userFound = await User.findOne({username}).exec();
        if (userFound) throw new HTTPError(400, 'User already exists');

        const hashedPassword = bcrypt.hashSync(password, 8);
        const user = new User({ username, password: hashedPassword, roles });
        return await user.save();
      };

    async login(username: string, password: string) {
        const userFound = await User.findOne({username}).exec();
        if (!userFound) throw new HTTPError(404, 'User not found');
        
        const passwordIsValid = bcrypt.compareSync(password, userFound.password);
        if (!passwordIsValid) throw new HTTPError(400, 'Invalid password');

        const token = jwt.sign({ id: userFound.id , roles: userFound.roles, username: userFound.username}, config.JWT_SECRET, { expiresIn: 86400 });
        return {token};
    }
}

