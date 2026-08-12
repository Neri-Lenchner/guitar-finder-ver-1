import express, { Request, Response, NextFunction } from "express";
import { statisticService } from "../services/statistic.service";
import { StatusCode } from "../models/enums";

class StatisticController {
    public readonly router = express.Router();

    constructor() {
        this.router.post("/api/stats/ingest", this.ingest);
        this.router.get("/api/stats", this.getStats);
    }

    private ingest = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
            const { brands } = request.body;
            const count = await statisticService.ingest(brands);
            response.json({ message: `Ingested ${count} listings` });
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
