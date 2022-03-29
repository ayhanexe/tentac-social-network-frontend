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

export interface IUser {
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
  profilePhotos: object[];
  userWalls: IUserWall[];
  token: string;
  letters?: string;
  birthDate?: string | Date | null;
  gender?: number;
  tel?: string | null;
}

export interface IUserWall {
  id: number;
  userId: string;
  photo: string;
  isDeleted: boolean;
  createDate: string;
  deleteDate: string | null;
  lastModificationDate: string | null;
}

export interface IUserProfilePhoto {
  id: number;
  userId: string;
  photo: string;
  isDeleted: boolean;
  createDate: string;
  deleteDate: string | null;
  lastModificationDate: string | null;
}
