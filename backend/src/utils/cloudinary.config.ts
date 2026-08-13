import { v2 as cloudinary } from "cloudinary";
import { appConfig } from "./app-config";

cloudinary.config({
    cloud_name: appConfig.cloudinaryCloudName,
    api_key: appConfig.cloudinaryApiKey,
    api_secret: appConfig.cloudinaryApiSecret,
});

export { cloudinary };
