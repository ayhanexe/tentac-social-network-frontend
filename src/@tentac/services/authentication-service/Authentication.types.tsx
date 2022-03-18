import { IUserRole } from "../../types/auth/authTypes";


export interface ILoginResponse {
  id:string | null;
  message: string;
  isAuthenticated: boolean;
  username: string;
  email: string;
  roles: string[];
  token: string;
  errors: [];
}

export interface IRegisterResponse {
  message: string;
  hasError: boolean;
  errors: { key: string };
}

export default interface IAuthenticationService {
  Login(email: string, password: string): Promise<ILoginResponse>;
  Register(
    username: string,
    email: string,
    password: string,
    passwordAgain: string,
    name: string,
    surname: string
  ): Promise<IRegisterResponse>;
}
