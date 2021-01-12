import { UploadFile } from "@/types/schema";

export interface GetTrackArgs {
  trackID: number;
}

export interface SearchTrackArgs {
  fingerprint: Promise<UploadFile>;
  fingerprintInfo: {
    windowAmount: Number;
    partitionAmount: Number;
  };
}

export interface AddTrackArgs {
  fingerprint: Promise<UploadFile>;
  trackData: {
    title: string;
    artists: string[];
    coverImage?: string;
    releaseDate?: string;
  };
}

export interface EditTrackArgs {
  trackID: number;
  updatedTrackData: {
    title?: string;
    artists?: string[];
    coverImage?: string;
    releaseDate?: string;
  };
}

export interface DeleteTrackArgs {
  trackID: number;
}

export interface RecomputeTrackFingerprintArgs {
  trackID: number;
  fingerprint: Promise<UploadFile>;
}
