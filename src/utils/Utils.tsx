import { flatMapDepth, isObject, sortBy } from "lodash";
import path from "path-browserify";
import { store } from "../@tentac/redux/store";
import { IAuthenticationServiceState } from "../@tentac/services/authentication-service/state/Authentication.state.types";
import UserService from "../@tentac/services/user-service/user-service";
import { IUser } from "../@tentac/types/auth/authTypes";

export default function ClearStyleAttribute(element?: Element | null) {
  element?.setAttribute("style", "");
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

export function getCurrentUser(): Promise<IUser | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const userService: UserService = new UserService();
      const state: IAuthenticationServiceState = store.getState().auth;
      let user: IUser | null = null;

      if (state.user) {
        user =
          (await userService.get(`${state.user?.id}`, {
            bearerToken: `${state.user?.token}`,
          })) ?? null;
      }

      user = {
        ...user,
        letters:
          user?.name && user?.surname
            ? `${user.name[0]} ${user.surname[0]}`
            : null,
      } as IUser;

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

export function getUserProfilePhoto(user: IUser): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const usersSortedProfilePhotos = user?.profilePhotos?.map(
        (user: any) => ({
          ...user,
          createDate: new Date(user.createDate).toDateString(),
        })
      );

      const _profilePhoto = sortBy(
        usersSortedProfilePhotos,
        (user: any) => user.createDate
      ).reverse()[0];

      if (_profilePhoto) {
        resolve(
          path.join(
            `${process.env.REACT_APP_STATIC_FILES_BASE}`,
            "/media/profiles/",
            _profilePhoto.photo
          )
        );
      } else {
        reject();
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function getUserWallPhoto(user: IUser): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const usersSortedWallPhotos = user?.userWalls?.map((user: any) => ({
        ...user,
        createDate: new Date(user.createDate).toDateString(),
      }));

      const _wallPhoto = sortBy(
        usersSortedWallPhotos,
        (user: any) => user.createDate
      ).reverse()[0];

      if (_wallPhoto) {
        resolve(
          path.join(
            `${process.env.REACT_APP_STATIC_FILES_BASE}`,
            "/media/walls/",
            _wallPhoto.photo
          )
        );
      } else {
        reject();
      }
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
