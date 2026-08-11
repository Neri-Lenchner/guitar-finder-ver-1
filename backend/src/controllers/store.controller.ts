import express, { Request, Response, NextFunction } from "express";
import { storeService } from "../services/store.service";
import { ValidationError } from "../models/client-error";

class StoreController {
    public readonly router = express.Router();

    constructor() {
        this.router.get("/api/stores", this.search);
    }

    public async search(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const city = request.query.city as string;
            if (!city?.trim()) throw new ValidationError("City is required");
            const stores = await storeService.searchByCity(city.trim());
            response.json(stores);
        } catch (error) { next(error); }
    }
}

export const storeController = new StoreController();
