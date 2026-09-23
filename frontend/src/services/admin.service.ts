import axios from "axios";
import { appConfig } from "../utils/app-config";

export interface IAdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    profileImage: string | null;
    createdAt: string;
}

export interface IIntegrationStatus {
    reverb: boolean;
    ebay: boolean;
    etsy: boolean;
}

class AdminService {
    public async getUsers(): Promise<IAdminUser[]> {
        const res = await axios.get(`${appConfig.apiAddress}/api/admin/users`);
        return res.data;
    }

    public async getIntegrationStatus(): Promise<IIntegrationStatus> {
        const res = await axios.get(`${appConfig.apiAddress}/api/admin/integrations`);
        return res.data;
    }

    public async setAdminStatus(id: string, isAdmin: boolean): Promise<IAdminUser> {
        const res = await axios.put(`${appConfig.apiAddress}/api/admin/users/${id}/admin-status`, { isAdmin });
        return res.data;
    }

    public async deleteUser(id: string): Promise<void> {
        await axios.delete(`${appConfig.apiAddress}/api/admin/users/${id}`);
    }
}

export const adminService = new AdminService();
