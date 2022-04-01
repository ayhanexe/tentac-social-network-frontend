import { IAuthUser, IBackendUser } from "../../types/auth/authTypes";
import AutoCRUD from "../../utils/AutoCRUD";
import path from "path-browserify";
import axios from "axios";
import { IAutoCrudOptions } from "../../utils/AutoCRUD.type";

export default class UserService extends AutoCRUD<IBackendUser, string> {
  constructor() {
    const apiUrl: string = path.join(
      `${process.env.REACT_APP_API_BASE}`,
      "Users"
    );
    super(apiUrl);
  }

  async uploadProfileImage(
    data: FormData,
    id: string,
    options?: IAutoCrudOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(path.join(this.apiUrl, "addProfile", id), data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${options?.bearerToken}`,
              token: `${options?.token}`,
            },
          })
          .then(({data}) => {
            resolve(data);
          })
          .catch((e) => {
            reject(null);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async uploadWallImage(
    data: FormData,
    id: string,
    options?: IAutoCrudOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(path.join(this.apiUrl, "addWall", id), data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${options?.bearerToken}`,
              token: `${options?.token}`,
            },
          })
          .then(({data}) => {
            resolve(data);
          })
          .catch((e) => {
            reject(null);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
}
