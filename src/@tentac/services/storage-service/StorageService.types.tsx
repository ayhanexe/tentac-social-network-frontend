export interface IStorageService {
  SaveData: (patch: IStoragePatch, isSessionData: boolean) => Promise<void>;
  RemoveData: (deleteKey: string, fromSession: boolean) => Promise<void>;
  GetAllData: (getSessionData: boolean) => Promise<IStorage>;
  DestroyData: (destroyLocal:boolean) => Promise<void>;
  TestData: () => Promise<void>;
}

export interface IStorage {
  auth?: {
    email: string;
    username: string;
    fullname: string;
    token: string;
    roles: string[];
  } | null;
}

export interface IStoragePatch {
  auth?: {
    email?: string;
    username?: string;
    fullname?: string;
    roles?: string[];
    token?: string;
  };
}
