import rateLimit from "express-rate-limit";
import { appConfig } from "../utils/app-config";
import { StatusCode } from "../models/enums";

class RateLimitMiddleware {
    public readonly general = rateLimit({
        windowMs: appConfig.generalRateLimitWindowMs,
        max: appConfig.generalRateLimitMax,
        standardHeaders: true,
        legacyHeaders: false,
        message: { message: "Too many requests, please try again later." },
    });

    public readonly auth = rateLimit({
        windowMs: appConfig.authRateLimitWindowMs,
        max: appConfig.authRateLimitMax,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true,
        statusCode: StatusCode.TooManyRequests,
        message: { message: "Too many login attempts, please try again later." },
    });

    public readonly chat = rateLimit({
        windowMs: appConfig.chatRateLimitWindowMs,
        max: appConfig.chatRateLimitMax,
        standardHeaders: true,
        legacyHeaders: false,
        statusCode: StatusCode.TooManyRequests,
        message: { message: "You're chatting with GuitarGod too fast, please slow down." },
    });

    public readonly ingest = rateLimit({
        windowMs: appConfig.ingestRateLimitWindowMs,
        max: appConfig.ingestRateLimitMax,
        standardHeaders: true,
        legacyHeaders: false,
        statusCode: StatusCode.TooManyRequests,
        message: { message: "Stats ingest was triggered too recently, please wait before re-running it." },
    });
}

export const rateLimitMiddleware = new RateLimitMiddleware();
