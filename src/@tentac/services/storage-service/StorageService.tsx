import { merge, unset } from "lodash";
import { GetPropertyPath } from "../../../utils/Utils";
import {
  IStorage,
  IStoragePatch,
  IStorageService,
} from "./StorageService.types";

export default class StorageService implements IStorageService {
  // ## Utils ##
  private get storageAccessor(): string {
    return "tentac-data";
  }

  private get initialData(): IStorage {
    return {
      auth: null,
    };
  }

  private checkData(checkLocal: boolean = true): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const data: IStorage = checkLocal
          ? await this.localDataAsJSON
          : await this.sessionDataAsJSON;

        if (data) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private recoverData(recoverSession: boolean = false): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (recoverSession) {
          sessionStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(this.initialData)
          );
        } else {
          localStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(this.initialData)
          );
        }

        if (await this.checkData(!recoverSession)) {
          resolve();
        } else {
          setTimeout(async () => {
            await this.recoverData(recoverSession);
          }, 1000);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private get localDataAsJSON(): Promise<IStorage> {
    return new Promise(async (resolve, reject) => {
      try {
        const data: string | null = localStorage.getItem(
          `${this.storageAccessor}`
        );

        if (!data)
          localStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(this.initialData)
          );
        else {
          try {
            const _parsedData = JSON.parse(data);
            resolve(_parsedData);
          } catch (error) {
            console.error(
              "%cLocal storage data are corrupted!\nRollbacked original state.",
              "background-color:black; color:white;"
            );
            await this.recoverData();
            return this.localDataAsJSON;
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private get sessionDataAsJSON(): Promise<IStorage> {
    return new Promise(async (resolve, reject) => {
      try {
        const data: string | null = sessionStorage.getItem(
          `${this.storageAccessor}`
        );

        if (!data)
          sessionStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(this.initialData)
          );
        else {
          try {
            const _parsedData = JSON.parse(data);
            resolve(_parsedData);
          } catch (error) {
            console.error(
              "%cLocal storage data are corrupted!\nRollbacked original state.",
              "background-color:black; color:white;"
            );
            await this.recoverData();
            return this.sessionDataAsJSON;
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // ## Utils End ##

  TestData = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        await this.localDataAsJSON;
        resolve();
      } catch (error) {
        await this.recoverData();
        reject(error);
      }
    });
  };

  GetAllData = async (getSessionData: boolean = false): Promise<IStorage> => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = getSessionData
          ? await this.sessionDataAsJSON
          : await this.localDataAsJSON;
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };

  SaveData = (
    patch: IStoragePatch,
    isSessionData: boolean = false
  ): Promise<void> =>
    new Promise(async (resolve, reject) => {
      try {
        if (await this.checkData(!isSessionData)) {
          const data = isSessionData
            ? await this.sessionDataAsJSON
            : await this.localDataAsJSON;
          const patchedData = merge({}, data, patch);

          if (isSessionData) {
            sessionStorage.setItem(
              `${this.storageAccessor}`,
              JSON.stringify(patchedData)
            );
          } else {
            localStorage.setItem(
              `${this.storageAccessor}`,
              JSON.stringify(patchedData)
            );
          }

          resolve();
        } else {
          await this.recoverData();
          await this.SaveData(patch, isSessionData);
        }
      } catch (error) {
        reject(error);
      }
    });

  RemoveData = (
    deleteKey: string,
    fromSession: boolean = false
  ): Promise<void> =>
    new Promise(async (resolve, reject) => {
      try {
        const storage = fromSession
          ? this.sessionDataAsJSON
          : await this.localDataAsJSON;
        const path = GetPropertyPath(storage, deleteKey);
        unset(storage, path);

        if (fromSession) {
          sessionStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(storage)
          );
        } else {
          localStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(storage)
          );
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });

  DestroyData = (destroyLocal: boolean = true): Promise<void> =>
    new Promise((resolve, reject) => {
      try {
        if (destroyLocal) {
          localStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(this.initialData)
          );
        } else {
          sessionStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(this.initialData)
          );
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
}
