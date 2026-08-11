export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
}

export interface IUserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ICredentials {
    email: string;
    password: string;
}
