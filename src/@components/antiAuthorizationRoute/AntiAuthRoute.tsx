import { ComponentType, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../@tentac/redux/store";
import { IAuthenticationServiceState } from "../../@tentac/services/authentication-service/state/Authentication.state.types";
import StorageService from "../../@tentac/services/storage-service/StorageService";
import { IStorage } from "../../@tentac/services/storage-service/StorageService.types";
import { IAntiAuthRoute } from "./AntiAuthRoute.types";

const AntiAuthRoute = <P,>(
  WrappedComponent: ComponentType<P>,
  antiAuthRouteProps: IAntiAuthRoute
) => {
  const [storage, setStorage] = useState<IStorage>({});
  const state: IAuthenticationServiceState = useSelector(
    (state: RootState) => state.auth
  );

  const storageService: StorageService = new StorageService();

  useEffect(() => {
    (async () => {
      const _storage = await storageService.GetAllData();
      setStorage(_storage);
    })();
  }, []);

  return (props: P) =>
    (state.user && state.user.token) || storage?.auth?.token ? (
      <Navigate to={antiAuthRouteProps.redirectTo ?? "/"} />
    ) : (
      <WrappedComponent {...props} />
    );
};

export default AntiAuthRoute;
