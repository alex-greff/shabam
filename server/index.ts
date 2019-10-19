import { Readable } from "stream";

export interface UploadFile {
    filename: String;
    mimetype: String;
    createReadStream(): Readable;
}

export interface UserData {
    email: string;
    role: string;
}

export interface UserDataContext {
    userData: UserData;
    [s: string]: any;
    [n: number]: any;
}

export interface RoleCheckConfig {
    userEmailPath: string;
}

export interface UserAccount {
    id: string;
    email: string;
    password: string;
    role: string;
    signupDate: string;
    lastLogin: string;
}