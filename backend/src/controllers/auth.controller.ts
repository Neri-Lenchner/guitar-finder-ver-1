import express, { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { UserModel } from "../models/user.model";
import { StatusCode } from "../models/enums";
import { upload } from "../utils/multer.config";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware";

class AuthController {
    public readonly router = express.Router();

    constructor() {
        this.router.post("/api/auth/register", rateLimitMiddleware.auth, upload.single("profileImage"), this.register);
        this.router.post("/api/auth/login", rateLimitMiddleware.auth, this.login);
    }

    public async register(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const userData = new UserModel(request.body);
            if (request.file) userData.profileImage = request.file.path;
            const token: string = await authService.register(userData);
            response.status(StatusCode.Created).json(token);
        } catch (error) { next(error); }
    }

    public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token: string = await authService.login(request.body);
            response.json(token);
        } catch (error) { next(error); }
    }
}

export const authController = new AuthController();
