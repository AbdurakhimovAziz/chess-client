import { User } from './user';

export interface SigninResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  message: string;
}
