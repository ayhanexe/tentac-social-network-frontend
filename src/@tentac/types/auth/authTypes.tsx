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
  userWalls: object[];
  token: string;
  letters?: string;
}
