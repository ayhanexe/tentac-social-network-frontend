import axios from "axios";
import IAuthenticationService, {
  ILoginResponse,
  IRegisterResponse,
} from "./Authentication.types";
import path from "path-browserify";

export default class AuthenticationService implements IAuthenticationService {
  async Login(email: string, password: string): Promise<ILoginResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await axios
          .post(
            path.join(
              `${process.env.REACT_APP_AUTHENTICATION_API_URL}`,
              "Login"
            ),
            {
              Email: email,
              Password: password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            resolve({
              errors: [],
              ...response.data,
            });
          })
          .catch((error) =>
            reject({
              errors: [],
              ...error.response.data,
            } as ILoginResponse)
          );
      } catch (error: any) {
        resolve({
          isAuthenticated: false,
          message: `${error.message}`,
          email: "",
          roles: [],
          token: "",
          username: "",
          errors: [],
        } as ILoginResponse);
      }
    });
  }

  async Register(
    username: string,
    email: string,
    password: string,
    passwordAgain: string,
    name: string,
    surname: string
  ): Promise<IRegisterResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await axios
          .post(
            path.join(
              `${process.env.REACT_APP_AUTHENTICATION_API_URL}`,
              "Register"
            ),
            {
              Email: email,
              Username: username,
              Password: password,
              PasswordAgain: passwordAgain,
              FullName: `${name} ${surname}`,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => reject(error.response.data));
      } catch (error: any) {
        resolve({
          hasError: true,
          message: `${error.message}`,
        } as IRegisterResponse);
      }
    });
  }
}
