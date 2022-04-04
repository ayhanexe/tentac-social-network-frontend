import path from "path-browserify";
import { IPost } from "../../types/auth/userTypes";
import AutoCRUD from "../../utils/AutoCRUD";

export default class PostService extends AutoCRUD<IPost, number> {
  constructor() {
    const apiUrl: string = path.join(
      `${process.env.REACT_APP_API_BASE}`,
      "Posts"
    );
    super(apiUrl);
  }
}
