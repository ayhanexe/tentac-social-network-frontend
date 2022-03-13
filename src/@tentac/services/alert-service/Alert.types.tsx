import { SweetAlertOptions } from "sweetalert2";

export interface IAlertOptions extends SweetAlertOptions {}

export default interface IAlertService {
  Success<T = void>(
    options: IAlertOptions,
    successCallback?: () => {} | Promise<T>,
    errorCallback?: () => {} | Promise<T>
  ): Promise<void>;
  Error<T = void>(
    options: IAlertOptions,
    successCallback?: () => {} | Promise<T>,
    errorCallback?: () => {} | Promise<T>
  ): Promise<void>;
  Warning<T = void>(
    options: IAlertOptions,
    successCallback?: () => {} | Promise<T>,
    errorCallback?: () => {} | Promise<T>
  ): Promise<void>;
  Information<T = void>(
    options: IAlertOptions,
    successCallback?: () => {} | Promise<T>,
    errorCallback?: () => {} | Promise<T>
  ): Promise<void>;
  Question<T = void>(
    options: IAlertOptions,
    successCallback?: () => {} | Promise<T>,
    errorCallback?: () => {} | Promise<T>
  ): Promise<void>;
  Normal<T = void>(
    options: IAlertOptions,
    successCallback?: () => {} | Promise<T>,
    errorCallback?: () => {} | Promise<T>
  ): Promise<void>;
}
