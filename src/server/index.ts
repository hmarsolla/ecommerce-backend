import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import Router from './router';
import errorHandler from './middleware/error';

export default class HTTPServer {
    app: express.Application;

	constructor() {
		this.app = express();

		this.app.enable('trust proxy');
		this.app.use(compression());
		this.app.use(helmet());
		this.app.use(express.json({limit: '50mb'}));
		this.app.use(express.urlencoded({limit: '50mb', extended: true}));
		this.app.use(cookieParser());
		this.app.use(cors());
        
		this.app.use('/api/v1/', Router());
        
		this.app.use(errorHandler);
	}

	async listen(host: string, port: number) {
        console.log(`Listening http on port: ${port}, to access the UI go to http://${host}:${port}`);
        this.app.listen(port, host)
	}    
}