import { merge, unset } from "lodash";
import { GetPropertyPath } from "../../../utils/Utils";
import { IStorage, IStorageService } from "./StorageService.types";

export default class StorageService implements IStorageService {
  // ## Utils ##
  private get storageAccessor(): string {
    return "tentac-data";
  }

  private get initialData(): IStorage {
    return {
      auth: {
        fullname: "Aykhan Abdullayev",
      },
    };
  }

  private checkData(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const data: IStorage = await this.dataAsJSON;

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

  private recoverData(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        localStorage.setItem(
          `${this.storageAccessor}`,
          JSON.stringify(this.initialData)
        );

        if (await this.checkData()) {
          resolve();
        } else {
          setTimeout(async () => {
            await this.recoverData();
          }, 1000);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private get dataAsJSON(): Promise<IStorage> {
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
            return this.dataAsJSON;
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
        await this.dataAsJSON;
        resolve();
      } catch (error) {
        await this.recoverData();
        reject(error);
      }
    });
  };

  GetAllData = async (): Promise<IStorage> => {
    return await this.dataAsJSON;
  };

  SaveData = (patch: IStorage): Promise<void> =>
    new Promise(async (resolve, reject) => {
      try {
        if (await this.checkData()) {
          const data = await this.dataAsJSON;
          const patchedData = merge({}, data, patch);

          localStorage.setItem(
            `${this.storageAccessor}`,
            JSON.stringify(patchedData)
          );

          resolve();
        } else {
          await this.recoverData();
          await this.SaveData(patch);
        }
      } catch (error) {
        reject(error);
      }
    });

  RemoveData = (deleteKey: string): Promise<void> =>
    new Promise(async (resolve, reject) => {
      try {
        const storage = await this.dataAsJSON;
        const path = GetPropertyPath(storage, deleteKey);
        unset(storage, path);
        localStorage.setItem(
          `${this.storageAccessor}`,
          JSON.stringify(storage)
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  DestroyData = (): Promise<void> => new Promise((resolve, reject) => {});
}
