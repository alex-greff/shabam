import { UserRole } from './modules/policies/policy.types';

export interface UserRequestData {
  username: string;
  role: UserRole;
}

export interface Fingerprint {
  numberOfWindows: number;
  numberOfPartitions: number;
  data: Uint32Array;
}