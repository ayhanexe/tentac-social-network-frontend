import axios from "axios";
import path from "path-browserify";
import { IAutoCRUD, IAutoCrudOptions } from "./AutoCRUD.type";

export default abstract class AutoCRUD<EntityType, EntityKey>
  implements IAutoCRUD<EntityType, EntityKey>
{
  protected apiUrl: string = "";

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getAll(options?: IAutoCrudOptions): Promise<EntityType[]> {
    try {
      const response = await axios
        .get<EntityType[]>(`${this.apiUrl}`, {
          headers: {
            Authorization: `Bearer ${options?.bearerToken}`,
          },
        })
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data as EntityType[];
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async get(id: EntityKey, options: IAutoCrudOptions): Promise<EntityType> {
    try {
      const response = await axios
        .get<EntityType>(path.join(`${this.apiUrl}`, `${id}`), {
          headers: {
            Authorization: `Bearer ${options?.bearerToken}`,
          },
        })
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data as EntityType;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async update(
    id: EntityKey,
    entity: EntityType,
    options: IAutoCrudOptions
  ): Promise<EntityType> {
    try {
      const response = await axios
        .put<EntityType>(
          path.join(`${this.apiUrl}`, `${id}`),
          {
            ...entity,
          },
          {
            headers: {
              Authorization: `Bearer ${options?.bearerToken}`,
              token: `${options.token}`,
            },
          }
        )
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data as EntityType;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async delete(id: EntityKey, options: IAutoCrudOptions): Promise<EntityType> {
    try {
      const response = await axios
        .delete(path.join(`${this.apiUrl}`, `${id}`), {
          headers: {
            Authorization: `Bearer ${options?.bearerToken}`,
            token: `${options.token}`,
          },
        })
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));

      return response.data as EntityType;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async create(
    entity: EntityType,
    options: IAutoCrudOptions
  ): Promise<EntityType> {
    try {
      const response = await axios
        .post(
          this.apiUrl,
          {
            ...entity,
          },
          {
            headers: {
              Authorization: `Bearer ${options?.bearerToken}`,
              token: `${options.token}`,
            },
          }
        )
        .then(async (data: any) => {
          await options?.success?.call(data, this);
          return data;
        })
        .catch(async (error) => {
          await options?.fail?.call(error, this);
          return error;
        })
        .finally(async () => await options?.finally?.call(this));
      return response.data as EntityType;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
}
