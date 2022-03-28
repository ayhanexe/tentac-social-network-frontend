export interface IAutoCrudOptions {
  bearerToken?: string;
  token?: string;
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
  create(entity: EntityKey, options: IAutoCrudOptions): Promise<EntityType>;
}
