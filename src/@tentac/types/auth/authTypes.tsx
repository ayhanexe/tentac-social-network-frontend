export enum IUserRole {
  superuser,
  admin,
  moderator,
  user,
}

export interface IUser {
  fullName: string;
  id: string;
  userName: string;
  email: string;
  emailConfirmed: false;
  phoneNumber: null;
  phoneNumberConfirmed: false;
  twoFactorEnabled: false;
  lockoutEnd: null;
  accessFailedCount: 0;
  roles: string[];
}
