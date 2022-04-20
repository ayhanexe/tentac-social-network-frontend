import { IBackendUser } from "../../types/auth/authTypes";

export interface IStory {
  user: IBackendUser;
  text: string;
  id: number;
}
