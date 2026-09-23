export interface IAdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    profileImage: string | null;
    createdAt: Date;
}

export interface IIntegrationStatus {
    reverb: boolean;
    ebay: boolean;
    etsy: boolean;
}
