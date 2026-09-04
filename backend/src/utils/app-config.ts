class AppConfig {
    public readonly port: number = parseInt(process.env.PORT || "4000");
    public readonly mongodbConnectionString: string = process.env.MONGODB_CONNECTION_STRING!;
    public readonly secretKey: string = process.env.JWT_SECRET_KEY!;
    public readonly openAiApiKey: string = process.env.OPENAI_API_KEY!;
    public readonly reverbToken: string = process.env.REVERB_API_TOKEN || "";
    public readonly cloudinaryCloudName: string = process.env.CLOUDINARY_CLOUD_NAME!;
    public readonly cloudinaryApiKey: string = process.env.CLOUDINARY_API_KEY!;
    public readonly cloudinaryApiSecret: string = process.env.CLOUDINARY_API_SECRET!;

    public readonly generalRateLimitWindowMs: number = parseInt(process.env.GENERAL_RATE_LIMIT_WINDOW_MS || "900000");
    public readonly generalRateLimitMax: number = parseInt(process.env.GENERAL_RATE_LIMIT_MAX || "300");
    public readonly authRateLimitWindowMs: number = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "900000");
    public readonly authRateLimitMax: number = parseInt(process.env.AUTH_RATE_LIMIT_MAX || "10");
    public readonly chatRateLimitWindowMs: number = parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS || "900000");
    public readonly chatRateLimitMax: number = parseInt(process.env.CHAT_RATE_LIMIT_MAX || "20");

    public readonly allowedOrigins: string[] = (
        process.env.CORS_ALLOWED_ORIGINS ||
        "https://lucid-wholeness-production-0cba.up.railway.app,http://localhost:5173,http://localhost"
    ).split(",").map(origin => origin.trim());
}

export const appConfig = new AppConfig();
