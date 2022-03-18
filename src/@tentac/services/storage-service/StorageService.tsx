import { IStorage, IStorageService } from "./StorageService.types";

export default class StorageService implements IStorageService {
  // ## Utils ##
  private get initialData(): IStorage {
    return {
      auth: {},
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
        localStorage.setItem("tentac-data", JSON.stringify(this.initialData));

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
        const data: string | null = localStorage.getItem("tentac-data");

        if (!data)
          localStorage.setItem("tentac-data", JSON.stringify(this.initialData));
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

  GetAllData = async (): Promise<IStorage> => {
    return await this.dataAsJSON;
  };

  SaveData = (patch: IStorage): Promise<void> =>
    new Promise(async (resolve, reject) => {
      try {
        if (await this.checkData()) {
          const data = await this.dataAsJSON;
          
          
        } else {
          await this.recoverData();
          await this.SaveData(patch);
        }
      } catch (error) {
        reject(error);
      }
    });

  RemoveData = (patch: IStorage): Promise<void> =>
    new Promise((resolve, reject) => {});

  DestroyData = (): Promise<void> => new Promise((resolve, reject) => {});
}
