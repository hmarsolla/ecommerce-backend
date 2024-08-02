import { Request, Response, NextFunction } from 'express';
import HTTPError from "../helpers/httpError";

export default function error(err: any, req: Request, res: Response, next: NextFunction) {  // eslint-disable-line no-unused-vars
    if (!(err instanceof HTTPError)) {
		if (err.status) err = new HTTPError(err.status, err.message);
		else if (err.statusCode) err = new HTTPError(err.statusCode, err.message);
		else err = new HTTPError(500, err.message);
	}

	res.status(err.status);
    console.error(err.toPrint());
    
    res.json({ status: err.status, message: err.message });
    next();
};