class AppConfig {
    public readonly port: number = parseInt(process.env.PORT || "4000");
    public readonly mongodbConnectionString: string = process.env.MONGODB_CONNECTION_STRING!;
    public readonly secretKey: string = process.env.JWT_SECRET_KEY!;
    public readonly openAiApiKey: string = process.env.OPENAI_API_KEY!;
    public readonly reverbToken: string = process.env.REVERB_API_TOKEN || "";
    public readonly cloudinaryCloudName: string = process.env.CLOUDINARY_CLOUD_NAME!;
    public readonly cloudinaryApiKey: string = process.env.CLOUDINARY_API_KEY!;
    public readonly cloudinaryApiSecret: string = process.env.CLOUDINARY_API_SECRET!;
}

export const appConfig = new AppConfig();
