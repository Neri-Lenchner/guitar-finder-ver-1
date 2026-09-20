import express, { Request, Response, NextFunction } from "express";
import { statisticService } from "../services/statistic.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware";
import { StatusCode } from "../models/enums";

class StatisticController {
    public readonly router = express.Router();

    constructor() {
        this.router.post("/api/stats/ingest", authMiddleware.validateAdmin, rateLimitMiddleware.ingest, this.ingest);
        this.router.get("/api/stats", this.getStats);
    }

    private ingest = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { brands } = request.body;
            if (!Array.isArray(brands) || !brands.length) {
                response.status(StatusCode.BadRequest).json({ message: "brands must be a non-empty array" });
                return;
            }
            const { count, matched } = await statisticService.ingest(brands);
            response.json({ message: `Ingested ${count} listings`, matched });
        } catch (error) { next(error); }
    };

    private getStats = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const stats = await statisticService.getStats();
            response.json(stats);
        } catch (error) { next(error); }
    };
}

export const statisticController = new StatisticController();
