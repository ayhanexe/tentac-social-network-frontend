export enum IUserRole {
  superuser,
  admin,
  moderator,
  user,
}

export interface ILoginResponse {
  message: string;
  isAuthenticated: boolean;
  username: string;
  email: string;
  roles: IUserRole[];
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
