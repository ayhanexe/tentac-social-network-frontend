import { IAuthUser } from "../../types/auth/authTypes";
import AutoCRUD from "../../utils/AutoCRUD";
import path from "path-browserify";
import axios from "axios";
import { IAutoCrudOptions } from "../../utils/AutoCRUD.type";

export default class UserService extends AutoCRUD<IAuthUser, string> {
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
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        axios({
          url: path.join(this.apiUrl, "addProfile", id),
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${options?.bearerToken}`,
            token: `${options?.token}`,
          },
        })
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            reject(false);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
}
