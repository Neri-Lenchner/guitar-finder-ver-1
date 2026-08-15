export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    profileImage: string | null;
}

export interface IUserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profileImage?: FileList;
}

export interface ICredentials {
    email: string;
    password: string;
}

export interface IEditProfileForm {
    firstName: string;
    lastName: string;
    profileImage: FileList;
}
