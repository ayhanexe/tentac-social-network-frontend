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
  const state: IAuthenticationServiceState = useSelector(
    (state: RootState) => state.auth
  );
  const [redirect, setRedirect] = useState<boolean>(false);
  const storageService: StorageService = new StorageService();

  useEffect(() => {
    if (state.user?.token) {
      setRedirect(true);
    } else {
      setRedirect(false);
    }
  }, [state]);

  useEffect(() => {
    (async () => {
      const storage = await storageService.GetAllData();
      const sessionStorage = await storageService.GetAllData(true);

      if (storage.auth?.token || sessionStorage.auth?.token) {
        setRedirect(true);
      } else {
        storageService.DestroyData();
      }
    })();
  }, []);

  return (props: P) =>
    redirect ? (
      <Navigate to={antiAuthRouteProps.redirectTo ?? "/"} />
    ) : (
      <WrappedComponent {...props} />
    );
};

export default AntiAuthRoute;
