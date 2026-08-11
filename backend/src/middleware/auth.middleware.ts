import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { appConfig } from "../utils/app-config";
import { AuthorizationError, ForbiddenError } from "../models/client-error";

class AuthMiddleware {
    public validateToken(request: Request, response: Response, next: NextFunction): void {
        const token: string | undefined = request.headers.authorization?.substring(7);
        if (!token) { next(new AuthorizationError("Unauthorized")); return; }
        try {
            jwt.verify(token, appConfig.secretKey);
            next();
        } catch {
            next(new AuthorizationError("Unauthorized"));
        }
    }

    public validateAdmin(request: Request, response: Response, next: NextFunction): void {
        const token: string | undefined = request.headers.authorization?.substring(7);
        if (!token) { next(new ForbiddenError("Forbidden")); return; }
        try {
            jwt.verify(token, appConfig.secretKey);
            const payload = jwt.decode(token) as { isAdmin: boolean };
            if (payload.isAdmin) next();
            else next(new ForbiddenError("Forbidden"));
        } catch {
            next(new ForbiddenError("Forbidden"));
        }
    }
}

export const authMiddleware = new AuthMiddleware();
