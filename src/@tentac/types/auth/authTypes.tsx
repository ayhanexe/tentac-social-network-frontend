import { IStory } from "../../services/story-service/story-service.types";
import { INotification } from "./userTypes";

enum AuthenticationTypes {
  LOGIN,
  REGISTER,
}

export default AuthenticationTypes;

export enum IUserRole {
  superuser,
  admin,
  moderator,
  user,
}

export interface IAuthUser {
  name: string;
  surname: string;
  id: string;
  userName: string;
  email: string;
  emailConfirmed?: false;
  phoneNumber?: null;
  phoneNumberConfirmed?: false;
  twoFactorEnabled?: false;
  lockoutEnd?: null;
  accessFailedCount?: 0;
  roles: string[];
  profilePhotoUrl: string | null;
  profilePhotoName: string | null;
  userPosts: any[];
  userWall: string | null;
  token: string;
  letters?: string;
  birthDate?: string | Date | null;
  gender?: number;
  tel?: string | null;
  userStories: IStory[];
  notifications: INotification[];
  friends: {
    friend: string;
    user: string;
  }[];
}

export interface IUserInfo {
  name: string;
  surname: string;
  id: string;
  userName: string;
  email: string;
  emailConfirmed?: false;
  phoneNumber?: null;
  phoneNumberConfirmed?: false;
  twoFactorEnabled?: false;
  lockoutEnd?: null;
  accessFailedCount?: 0;
  roles: string[];
  profilePhotoUrl: string | null;
  profilePhotoName: string | null;
  userWall: string | null;
  letters?: string;
  birthDate?: string | Date | null;
  gender?: number;
  tel?: string | null;
  userStories: IStory[];
  notifications: INotification[];
  friends: {
    friend: string;
    user: string;
  }[];
}

export interface IBackendUser {
  name: string;
  surname: string;
  id: string;
  userName: string;
  email: string;
  emailConfirmed?: false;
  phoneNumber?: null;
  phoneNumberConfirmed?: false;
  twoFactorEnabled?: false;
  lockoutEnd?: null;
  accessFailedCount?: 0;
  roles: string[];
  profilePhoto: string | null;
  userWall: string | null;
  userPosts: any[];
  token: string;
  letters?: string;
  birthDate?: string | Date | null;
  gender?: number;
  tel?: string | null;
  userStories: IStory[];
  notifications: INotification[];
  friends: {
    friend: string;
    user: string;
  }[];
}
