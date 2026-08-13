class AppConfig {
    public readonly apiAddress: string = import.meta.env.VITE_API_ADDRESS || "http://localhost:4000"; // production: set VITE_API_ADDRESS env var on Railway
}

export const appConfig = new AppConfig();
# trigger rebuild
