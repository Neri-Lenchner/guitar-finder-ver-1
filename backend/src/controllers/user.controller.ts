import express, { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import { ValidationError } from "../models/client-error";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../utils/multer.config";
import { appConfig } from "../utils/app-config";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

class UserController {
    public readonly router = express.Router();

    constructor() {
        this.router.put("/api/users/:id", authMiddleware.validateToken, upload.single("profileImage"), this.updateProfile);
    }

    public async updateProfile(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = request.params;
            const user = await UserModel.findById(id).exec();
            if (!user) throw new ValidationError("User not found");

            if (request.body.firstName) user.firstName = request.body.firstName;
            if (request.body.lastName) user.lastName = request.body.lastName;

            if (request.file) {
                // Delete old image if it exists
                if (user.profileImage) {
                    const oldPath = path.join("uploads", user.profileImage);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                user.profileImage = request.file.filename;
            }

            const saved = await user.save();
            const token = jwt.sign(
                { _id: saved._id, firstName: saved.firstName, lastName: saved.lastName, email: saved.email, isAdmin: saved.isAdmin, profileImage: saved.profileImage },
                appConfig.secretKey,
                { expiresIn: "3h" }
            );
            response.json(token);
        } catch (error) { next(error); }
    }
}

export const userController = new UserController();
