import { Request, Response, NextFunction } from 'express';
import HTTPError from "../helpers/httpError";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	if (err instanceof HTTPError) {
	  res.status(err.statusCode).json({ message: err.message });
	} else {
	  console.error(err); // Log the error for debugging purposes
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  }