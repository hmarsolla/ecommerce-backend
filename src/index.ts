import mongoose from "mongoose";
import HTTPServer from "./server";
import config from "./config";

(async () => {
    try {
        mongoose.connect(config.MONGO_URL).then(() => {
            console.log('Connected to MongoDB');
          }).catch((err) => {
            console.error('Failed to connect to MongoDB', err);
          });

        const server = new HTTPServer();
        server.listen(config.HOST, config.PORT);
    } catch (error) {
        console.error(error);
		process.exit(1);
    }
})();