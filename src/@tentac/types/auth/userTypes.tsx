import { IAuthUser, IBackendUser, IUserInfo } from "./authTypes";

export interface IPost {
  id?: number;
  userId: string;
  user?: any;
  text: string;
  isDeleted: boolean;
  createDate?: string;
  deleteDate?: string | null;
  lastModificationDate?: string | null;
  postLikes: any[];
  postReplies: any[];
}

export interface INotification {
  id: number;
  text: string;
  user: IBackendUser;
}
