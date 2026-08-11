import { UserModel } from "../models/user.model";
type IUserModel = InstanceType<typeof UserModel>;
import { ValidationError, AuthorizationError } from "../models/client-error";
import { appConfig } from "../utils/app-config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
    public async register(userData: IUserModel): Promise<string> {
        const error = userData.validateSync();
        if (error) throw new ValidationError(error.message);
        const isEmailTaken = await this.isEmailTaken(userData.email);
        if (isEmailTaken) throw new ValidationError("Email already taken");
        userData.isAdmin = false;
        userData.password = await bcrypt.hash(userData.password, 10);
        const saved = await userData.save();
        return jwt.sign(
            { _id: saved._id, firstName: saved.firstName, lastName: saved.lastName, email: saved.email, isAdmin: saved.isAdmin, profileImage: saved.profileImage },
            appConfig.secretKey,
            { expiresIn: "3h" }
        );
    }

    public async login(credentials: { email: string; password: string }): Promise<string> {
        if (!credentials.email || !credentials.password) throw new ValidationError("Email and password are required");
        const user = await UserModel.findOne({ email: credentials.email }).exec();
        if (!user) throw new AuthorizationError("Incorrect email or password");
        const isCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isCorrect) throw new AuthorizationError("Incorrect email or password");
        return jwt.sign(
            { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin, profileImage: user.profileImage },
            appConfig.secretKey,
            { expiresIn: "3h" }
        );
    }

    private async isEmailTaken(email: string): Promise<boolean> {
        const user = await UserModel.findOne({ email }).exec();
        return user !== null;
    }
}

export const authService = new AuthService();
