import { UserRole } from './modules/policies/policy.types';

export interface UserRequestData {
  username: string;
  role: UserRole;
}