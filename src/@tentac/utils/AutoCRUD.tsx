import axios from "axios";
import path from "path-browserify";
import { IAutoCRUD, IAutoCrudOptions } from "./AutoCRUD.type";

export default abstract class AutoCRUD<EntityType, EntityKey>
  implements IAutoCRUD<EntityType, EntityKey>
{
  private apiUrl: string = "";

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getAll(options?: IAutoCrudOptions): Promise<EntityType[]> {
    try {
      const response = await axios.get<EntityType[]>(`${this.apiUrl}`, {
        headers: {
          Authorization: `Bearer ${options?.bearerToken}`,
        },
      });

      return response.data as EntityType[];
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async get(id: EntityKey, options: IAutoCrudOptions): Promise<EntityType> {
    try {
      const response = await axios.get<EntityType>(
        path.join(`${this.apiUrl}`, `${id}`),
        {
          headers: {
            Authorization: `Bearer ${options?.bearerToken}`,
          },
        }
      );

      return response.data as EntityType;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  update(entity: EntityType, options: IAutoCrudOptions): Promise<EntityType> {
    throw new Error("Method not implemented.");
  }
  delete(id: EntityKey, options: IAutoCrudOptions): Promise<EntityType> {
    throw new Error("Method not implemented.");
  }
  create(entity: EntityKey, options: IAutoCrudOptions): Promise<EntityType> {
    throw new Error("Method not implemented.");
  }
}
