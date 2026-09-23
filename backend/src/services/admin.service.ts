import { UserModel } from "../models/user.model";
import { FollowedListingModel } from "../models/followed-listing.model";
import { ValidationError, NotFoundError } from "../models/client-error";
import { IAdminUser, IIntegrationStatus } from "../dto/admin.dto";
import { appConfig } from "../utils/app-config";

class AdminService {
    public async getAllUsers(): Promise<IAdminUser[]> {
        const users = await UserModel.find().select("-password").sort({ createdAt: -1 }).lean();
        return users as unknown as IAdminUser[];
    }

    public getIntegrationStatus(): IIntegrationStatus {
        return {
            reverb: !!appConfig.reverbToken,
            ebay: !!appConfig.ebayClientId && !!appConfig.ebayClientSecret,
            etsy: !!appConfig.etsyApiKey,
        };
    }

    public async setAdminStatus(targetId: string, isAdmin: boolean, requesterId: string): Promise<IAdminUser> {
        if (targetId === requesterId && !isAdmin) {
            throw new ValidationError("You can't remove your own admin access");
        }
        const user = await UserModel.findByIdAndUpdate(targetId, { isAdmin }, { new: true }).select("-password").lean();
        if (!user) throw new NotFoundError("User not found");
        return user as unknown as IAdminUser;
    }

    public async deleteUser(targetId: string, requesterId: string): Promise<void> {
        if (targetId === requesterId) {
            throw new ValidationError("You can't delete your own account");
        }
        const user = await UserModel.findByIdAndDelete(targetId).exec();
        if (!user) throw new NotFoundError("User not found");
        await FollowedListingModel.deleteMany({ userId: targetId });
    }
}

export const adminService = new AdminService();
