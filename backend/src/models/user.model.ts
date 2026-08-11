import { Document, model, Schema, Types } from "mongoose";

export interface IUserModel extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export const UserSchema = new Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [20, "First name must be at most 20 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [20, "Last name must be at most 20 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [4, "Password must be at least 4 characters"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

export const UserModel = model<IUserModel>("UserModel", UserSchema, "users");
