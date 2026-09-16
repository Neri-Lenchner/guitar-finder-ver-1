import express, { Request, Response, NextFunction } from "express";
import { etsyService } from "../services/etsy.service";

class EtsyController {
    public readonly router = express.Router();

    public constructor() {
        this.router.get("/api/etsy", this.searchListings);
    }

    private searchListings = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const query = request.query.query as string;
            if (!query?.trim()) {
                response.status(400).json({ message: "query param is required" });
                return;
            }
            const perPage = Math.min(parseInt(request.query.per_page as string) || 12, 50);
            const listings = await etsyService.searchListings(query.trim(), perPage);
            response.json(listings);
        } catch (err: any) {
            if (err.message === "Etsy API key not configured") {
                response.status(503).json({ message: "Etsy integration not enabled. Add ETSY_API_KEY to .env." });
                return;
            }
            next(err);
        }
    };
}

export const etsyController = new EtsyController();
