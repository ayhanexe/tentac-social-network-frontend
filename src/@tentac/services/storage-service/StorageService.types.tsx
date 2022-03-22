export interface IStorageService {
  SaveData: (patch: IStoragePatch) => Promise<void>;
  RemoveData: (deleteKey: string) => Promise<void>;
  GetAllData: () => Promise<IStorage>;
  DestroyData: () => Promise<void>;
  TestData: () => Promise<void>;
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
