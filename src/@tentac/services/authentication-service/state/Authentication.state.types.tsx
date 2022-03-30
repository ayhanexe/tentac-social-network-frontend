import { IAuthUser } from "../../../types/auth/authTypes";

export interface IAuthenticationServiceState {
  user: IAuthUser | null;
}
