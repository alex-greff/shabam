import { Readable } from "stream";

export interface TrackMetaData {
    title: string;
    artists: string[];
    coverImage?: string;
    uploaderUsername: string;
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
    username: string;
    role: string;
}

export interface UserAccount {
    id: number;
    username: string;
    password: string;
    role: string;
    signupDate: string;
    lastLogin: string;
}

export interface Token {
    token: string;
}
