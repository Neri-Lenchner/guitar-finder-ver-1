import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { adminService } from "../services/admin.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { StatusCode } from "../models/enums";

function getUserId(request: Request): string {
    const token = request.headers.authorization?.substring(7) ?? "";
    const payload = jwt.decode(token) as { _id: string };
    return payload._id;
}

class AdminController {
    public readonly router = express.Router();

    public constructor() {
        this.router.get("/api/admin/users", authMiddleware.validateAdmin, this.getUsers);
        this.router.put("/api/admin/users/:id/admin-status", authMiddleware.validateAdmin, this.setAdminStatus);
        this.router.delete("/api/admin/users/:id", authMiddleware.validateAdmin, this.deleteUser);
    }

    private getUsers = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await adminService.getAllUsers();
            response.json(users);
        } catch (error) { next(error); }
    };

    private setAdminStatus = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { isAdmin } = request.body;
            if (typeof isAdmin !== "boolean") {
                response.status(StatusCode.BadRequest).json({ message: "isAdmin must be a boolean" });
                return;
            }
            const targetId = request.params.id as string;
            const user = await adminService.setAdminStatus(targetId, isAdmin, getUserId(request));
            response.json(user);
        } catch (error) { next(error); }
    };

    private deleteUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const targetId = request.params.id as string;
            await adminService.deleteUser(targetId, getUserId(request));
            response.sendStatus(StatusCode.NoContent);
        } catch (error) { next(error); }
    };
}

export const adminController = new AdminController();
