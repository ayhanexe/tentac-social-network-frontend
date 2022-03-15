import { IUser } from "../../../types/auth/authTypes";

export interface IAuthenticationServiceState {
  user: IUser | null;
}
