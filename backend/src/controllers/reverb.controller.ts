import express, { Request, Response, NextFunction } from "express";
import { reverbService } from "../services/reverb.service";

class ReverbController {
    public readonly router = express.Router();

    public constructor() {
        this.router.get("/api/reverb", this.searchListings);
    }

    private searchListings = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const query = request.query.query as string;
            if (!query?.trim()) {
                response.status(400).json({ message: "query param is required" });
                return;
            }
            const listings = await reverbService.searchListings(query.trim());
            response.json(listings);
        } catch (err: any) {
            if (err.message === "Reverb API token not configured") {
                response.status(503).json({ message: "Reverb integration not enabled. Add REVERB_API_TOKEN to .env." });
                return;
            }
            next(err);
        }
    };
}

export const reverbController = new ReverbController();
