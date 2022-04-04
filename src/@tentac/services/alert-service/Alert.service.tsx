import Swal from "sweetalert2";
import IAlertService, { IAlertOptions } from "./Alert.types";

export default class AlertService implements IAlertService {
  async Success<T = void>(
    options: IAlertOptions,
    callback?: (data?:any) => {} | Promise<T>,
    errorCallback?: (data?:any) => {} | Promise<T>
  ): Promise<void> {
    await Swal.fire({
      ...options,
      icon: "success",
    })
      .then(callback)
      .catch(errorCallback);
  }
  async Error<T = void>(
    options: IAlertOptions,
    callback?: (data?:any) => {} | Promise<T>,
    errorCallback?: (data?:any) => {} | Promise<T>
  ): Promise<void> {
    await Swal.fire({
      ...options,
      icon: "error",
    })
      .then(callback)
      .catch(errorCallback);
  }
  async Warning<T = void>(
    options: IAlertOptions,
    callback?: (data?:any) => {} | Promise<T>,
    errorCallback?: (data?:any) => {} | Promise<T>
  ): Promise<void> {
    await Swal.fire({
      ...options,
      icon: "warning",
    })
      .then(callback)
      .catch(errorCallback);
  }
  async Information<T = void>(
    options: IAlertOptions,
    callback?: (data?:any) => {} | Promise<T>,
    errorCallback?: (data?:any) => {} | Promise<T>
  ): Promise<void> {
    await Swal.fire({
      ...options,
      icon: "info",
    })
      .then(callback)
      .catch(errorCallback);
  }
  async Question<T = void>(
    options: IAlertOptions,
    callback?: (data?:any) => {} | Promise<T>,
    errorCallback?: (data?:any) => {} | Promise<T>
  ): Promise<void> {
    await Swal.fire({
      ...options,
      icon: "question",
    })
      .then(callback)
      .catch(errorCallback);
  }
  async Normal<T = void>(
    options: IAlertOptions,
    callback?: (data?:any) => {} | Promise<T>,
    errorCallback?: (data?:any) => {} | Promise<T>
  ): Promise<void> {
    await Swal.fire({
      ...options,
      iconHtml: "",
    })
      .then(callback)
      .catch(errorCallback);
  }
}
