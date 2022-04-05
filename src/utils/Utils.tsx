import { flatMapDepth, isObject, sortBy } from "lodash";
import path from "path-browserify";
import { store } from "../@tentac/redux/store";
import { IAuthenticationServiceState } from "../@tentac/services/authentication-service/state/Authentication.state.types";
import UserService from "../@tentac/services/user-service/user-service";
import { IAuthUser, IBackendUser } from "../@tentac/types/auth/authTypes";

export default function ClearStyleAttribute(element?: Element | null) {
  element?.setAttribute("style", "");
}

export function removeHtmlTagsFromString(text: string) {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
}

export function GetPropertyPath(
  object: { [key: string]: any },
  key: string,
  memo: string = ""
) {
  let _memo = memo;
  Object.keys(object).map((objKey: string, index: number) => {
    _memo = `${memo === "" ? "" : `${memo}.`}${objKey}`;
    if (isObject(object[objKey])) {
      _memo = GetPropertyPath(object[objKey], key, _memo);
    }
  });
  return _memo;
}

export function getCurrentUser(): Promise<IAuthUser | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const state: IAuthenticationServiceState = store.getState().auth;
      let user: IAuthUser | null = null;
      let backendUser: IBackendUser | null = null;
      const userService: UserService = new UserService();

      if (state.user) {
        backendUser =
          (await userService.get(`${state.user?.id}`, {
            bearerToken: `${state.user?.token}`,
          })) ?? null;
      }

      if (backendUser) {
        user = {
          ...backendUser,
          profilePhotoUrl: backendUser.profilePhoto
            ? `${path.join(
                `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                "media/profiles",
                `${backendUser?.profilePhoto}`
              )}`
            : null,
          profilePhotoName: backendUser.profilePhoto,
          letters:
            backendUser.name && backendUser.surname
              ? `${backendUser.name[0]}${backendUser.surname[0]}`
              : null,
          token: state.user?.token,
        } as IAuthUser;
      }
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

export function generateColor(
  returnRgba: boolean = false,
  maxOpacity: number = 1
) {
  return `rgb${returnRgba ? "a" : ""}(${Math.random() * 255},${
    Math.random() * 255
  },${Math.random() * 255}${
    returnRgba ? `,${Math.random() * maxOpacity}` : ""
  })`;
}

export function getFileFromInput(element: HTMLInputElement): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (element.files && element.files.length > 0) {
        var oFReader = new FileReader();
        const file = element.files[0];
        oFReader.readAsDataURL(file);

        oFReader.onload = function (oFREvent) {
          resolve(`${oFREvent.target?.result}`);
        };
      }
    } catch (error) {
      reject(null);
    }
  });
}

export function makeAssetUrl(fileName: string, middleware: string) {
  return `${path.join(
    `${process.env.REACT_APP_STATIC_FILES_BASE}`,
    `${middleware}`,
    `${fileName}`
  )}`;
}
