class AppConfig {
    public readonly apiAddress: string = import.meta.env.VITE_API_ADDRESS || "http://localhost:4000";
}

export const appConfig = new AppConfig();
