import { IUser } from "./authTypes";

export interface IPost {
  id: number;
  userId: string;
  user: IUser;
  text: string;
  isDeleted: boolean;
  createDate: string;
  deleteDate: string | null;
  lastModificationDate: string | null;
}
