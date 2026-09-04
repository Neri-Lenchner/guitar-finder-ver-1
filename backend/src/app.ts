import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as mongoose from "mongoose";
import { mkdirSync } from "fs";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { rateLimitMiddleware } from "./middleware/rate-limit.middleware";
import { appConfig } from "./utils/app-config";
import { authController } from "./controllers/auth.controller";
import { chatController } from "./controllers/chat.controller";
import { userController } from "./controllers/user.controller";
import { storeController } from "./controllers/store.controller";
import { reverbController } from "./controllers/reverb.controller";
import { followedController } from "./controllers/followed.controller";
import { statisticController } from "./controllers/statistic.controller";

class App {
    public async start(): Promise<void> {
        mkdirSync("uploads", { recursive: true });
        const server = express();
        server.set("etag", false);
        server.use(helmet());
        server.use(cors({
            origin(origin, callback) {
                if (!origin || appConfig.allowedOrigins.includes(origin)) callback(null, true);
                else callback(new Error("Not allowed by CORS"));
            },
        }));
        server.use(express.json());
        server.use("/uploads", express.static("uploads"));
        await mongoose.connect(appConfig.mongodbConnectionString);
        server.use(loggerMiddleware.consoleLog);
        server.use("/api", rateLimitMiddleware.general);
        server.use(authController.router);
        server.use(chatController.router);
        server.use(userController.router);
        server.use(storeController.router);
        server.use(reverbController.router);
        server.use(followedController.router);
        server.use(statisticController.router);
        server.use(errorMiddleware.serverError);
        server.use(errorMiddleware.catchAll);
        server.listen(appConfig.port, () =>
            console.log(`Server is running on port ${appConfig.port}`)
        );
    }
}

const app = new App();
app.start();
