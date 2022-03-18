export interface IStorageService {
  SaveData: (patch: IStoragePatch) => Promise<void>;
  RemoveData: (patch: IStoragePatch) => Promise<void>;
  GetAllData: () => Promise<IStorage>;
  DestroyData: () => Promise<void>;
}

export interface IStorage {
  auth?: {
    email?: string;
    username?: string;
    fullname?: string;
    token?: string;
  };
}

export interface IStoragePatch {
  auth?: {
    email?: string;
    username?: string;
    fullname?: string;
    token?: string;
  };
}
