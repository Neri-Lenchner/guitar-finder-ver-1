class AppConfig {
    public readonly port: number = parseInt(process.env.PORT || "4000");
    public readonly mongodbConnectionString: string = process.env.MONGODB_CONNECTION_STRING!;
    public readonly secretKey: string = process.env.JWT_SECRET_KEY!;
    public readonly openAiApiKey: string = process.env.OPENAI_API_KEY!;
}

export const appConfig = new AppConfig();
