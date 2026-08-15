import express, { Request, Response, NextFunction } from "express";
import { chatService } from "../services/chat.service";
import { authMiddleware } from "../middleware/auth.middleware";

class ChatController {
    public readonly router = express.Router();

    constructor() {
        this.router.post("/api/chat", authMiddleware.validateToken, this.chat);
    }

    public async chat(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { message, history } = request.body;
            const reply = await chatService.getResponse(message, history);
            response.json({ reply });
        } catch (error) { next(error); }
    }
}

export const chatController = new ChatController();
