import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from './../../config';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'] as string;
    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized' });
        }
        req.body.credential = decoded;
        next();
    });
};