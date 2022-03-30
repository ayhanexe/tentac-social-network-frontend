import { IUserInfo } from "./authTypes";

export interface IPost {
  id: number;
  userId: string;
  user: IUserInfo;
  text: string;
  isDeleted: boolean;
  createDate: string;
  deleteDate: string | null;
  lastModificationDate: string | null;
}
