import axios from "axios";
import IAuthenticationService, {
  ILoginResponse,
  IRegisterResponse,
} from "./Authentication.types";
import path from "path-browserify";
import StorageService from "../storage-service/StorageService";
import { addUserInfo } from "./state/Authentication.actions";
import UserService from "../user-service/user-service";
import { IUser } from "../../types/auth/authTypes";
import { store } from "../../redux/store";
import { pick } from "lodash";

export default class AuthenticationService implements IAuthenticationService {
  Initialize(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const storageService: StorageService = new StorageService();
        const data = await storageService.GetAllData();
        const sessionData = await storageService.GetAllData(true);

        if (data.auth || sessionData.auth) {
          const userService: UserService = new UserService();
          userService
            .get(``, {
              bearerToken: `${data.auth?.token ?? sessionData.auth?.token}`,
            })
            .then(async (response) => {
              const search = Object.values(response).filter(
                (value: IUser) =>
                  value.email ===
                  `${data.auth?.email ?? sessionData.auth?.email}`
              );
              const localStore = await storageService.GetAllData();
              const sessionStore = await storageService.GetAllData(true);

              if (search.length === 0) {
                storageService.DestroyData();
              } else {
                store.dispatch(
                  addUserInfo({
                    ...pick(search[0], [
                      "email",
                      "name",
                      "surname",
                      "id",
                      "userName",
                      "roles",
                      "token",
                      "profilePhotos",
                      "userWalls",
                    ]),
                    ...pick(localStore.auth, ["roles", "token"]),
                    ...pick(sessionStore.auth, ["roles", "token"]),
                  })
                );
              }
            });

          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async Login(email: string, password: string): Promise<ILoginResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await axios
          .post(
            path.join(
              `${process.env.REACT_APP_API_BASE}`,
              "Authentication",
              "Login"
            ),
            {
              Email: email,
              Password: password,
            },
            {
              headers: {
                "Accept-Language": `${navigator.language}`,
                culture: `${navigator.language}`,
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
          id: null,
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
              `${process.env.REACT_APP_API_BASE}`,
              "Authentication",
              "Register"
            ),
            {
              Email: email,
              Username: username,
              Password: password,
              PasswordAgain: passwordAgain,
              Name: name,
              Surname: surname,
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
