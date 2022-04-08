export interface IAutoCrudOptions {
  bearerToken?: string;
  token?: string;
  success?: (...args: any) => any;
  fail?: (...args: any) => any;
  finally?: (...args: any) => any;
}

export interface IAutoCRUD<EntityType, EntityKey> {
  getAll(options: IAutoCrudOptions): Promise<EntityType[]>;
  get(id: EntityKey, options: IAutoCrudOptions): Promise<EntityType>;
  update(
    id: EntityKey,
    entity: EntityType,
    options: IAutoCrudOptions
  ): Promise<EntityType>;
  delete(id: EntityKey, options: IAutoCrudOptions): Promise<EntityType>;
  create(entity: EntityType, options: IAutoCrudOptions): Promise<EntityType>;
}
