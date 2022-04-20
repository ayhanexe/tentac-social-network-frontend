import path from "path-browserify";
import AutoCRUD from "../../utils/AutoCRUD";
import { IStory } from "./story-service.types";

export default class StoryService extends AutoCRUD<IStory, number> {
  constructor() {
    const apiUrl: string = path.join(
      `${process.env.REACT_APP_API_BASE}`,
      "Stories"
    );
    super(apiUrl);
  }
}
