import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.middleware";
import { FollowedListingModel } from "../models/followed-listing.model";
import { StatusCode } from "../models/enums";

function getUserId(request: Request): string {
    const token = request.headers.authorization?.substring(7) ?? "";
    const payload = jwt.decode(token) as { _id: string };
    return payload._id;
}

class FollowedController {
    public readonly router = express.Router();

    constructor() {
        this.router.get("/api/followed", authMiddleware.validateToken, this.getFollowed);
        this.router.post("/api/followed", authMiddleware.validateToken, this.follow);
        this.router.delete("/api/followed/:listingId", authMiddleware.validateToken, this.unfollow);
    }

    private getFollowed = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserId(request);
            const listings = await FollowedListingModel.find({ userId }).sort({ followedAt: -1 }).exec();
            response.json(listings);
        } catch (error) { next(error); }
    };

    private follow = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserId(request);
            const { listingId, title, price, condition, imageUrl, reverbUrl } = request.body;
            const existing = await FollowedListingModel.findOne({ userId, listingId }).exec();
            if (existing) { response.json(existing); return; }
            const followed = new FollowedListingModel({ userId, listingId, title, price, condition, imageUrl, reverbUrl });
            const saved = await followed.save();
            response.status(StatusCode.Created).json(saved);
        } catch (error) { next(error); }
    };

    private unfollow = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = getUserId(request);
            const { listingId } = request.params;
            await FollowedListingModel.findOneAndDelete({ userId, listingId }).exec();
            response.sendStatus(StatusCode.NoContent);
        } catch (error) { next(error); }
    };
}

export const followedController = new FollowedController();
