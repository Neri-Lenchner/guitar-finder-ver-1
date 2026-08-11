import "dotenv/config";
import express from "express";
import cors from "cors";
import * as mongoose from "mongoose";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { appConfig } from "./utils/app-config";
import { authController } from "./controllers/auth.controller";
import { chatController } from "./controllers/chat.controller";

class App {
    public async start(): Promise<void> {
        const server = express();
        server.set("etag", false);
        server.use(cors());
        server.use(express.json());
        await mongoose.connect(appConfig.mongodbConnectionString);
        server.use(loggerMiddleware.consoleLog);
        server.use(authController.router);
        server.use(chatController.router);
        server.use(errorMiddleware.serverError);
        server.use(errorMiddleware.catchAll);
        server.listen(appConfig.port, () =>
            console.log(`Server is running on port ${appConfig.port}`)
        );
    }
}

const app = new App();
app.start();
