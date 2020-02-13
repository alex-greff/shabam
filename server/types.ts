import { Readable } from "stream";

export interface TrackMetaData {
    title: string;
    artists: string[];
    coverImage?: string;
    uploaderEmail: string;
    releaseDate?: string;
    createdDate: string;
    updatedDate: string;
}

export interface Track {
    _id: number;
    addressDatabase?: number;
    metaData: TrackMetaData
}

export interface UploadFile {
    filename: string;
    mimetype: string;
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
    id: number;
    email: string;
    password: string;
    role: string;
    signupDate: string;
    lastLogin: string;
}

export interface Token {
    token: string;
}