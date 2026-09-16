import express, { Request, Response, NextFunction } from "express";
import { ebayService } from "../services/ebay.service";

class EbayController {
    public readonly router = express.Router();

    public constructor() {
        this.router.get("/api/ebay", this.searchListings);
    }

    private searchListings = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const query = request.query.query as string;
            if (!query?.trim()) {
                response.status(400).json({ message: "query param is required" });
                return;
            }
            const perPage = Math.min(parseInt(request.query.per_page as string) || 12, 50);
            const listings = await ebayService.searchListings(query.trim(), perPage);
            response.json(listings);
        } catch (err: any) {
            if (err.message === "eBay API credentials not configured") {
                response.status(503).json({ message: "eBay integration not enabled. Add EBAY_CLIENT_ID and EBAY_CLIENT_SECRET to .env." });
                return;
            }
            next(err);
        }
    };
}

export const ebayController = new EbayController();
