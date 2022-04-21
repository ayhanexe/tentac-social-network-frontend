import { IBackendUser } from "../../types/auth/authTypes";

export interface IStory {
  story: { user: IBackendUser; image: string; text: string };
  id: number;
}
