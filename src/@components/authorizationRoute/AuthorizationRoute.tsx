import { ComponentType, memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../@tentac/redux/store";
import { IAuthenticationServiceState } from "../../@tentac/services/authentication-service/state/Authentication.state.types";
import StorageService from "../../@tentac/services/storage-service/StorageService";
import { IAuthRoute } from "./AuthorizationRoute.types";

const AuthRoute = (
  WrappedComponent: ComponentType<any>,
  antiAuthRouteProps: IAuthRoute
) => {
  const [mount, setMount] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const state: IAuthenticationServiceState = useSelector(
    (state: RootState) => state.auth
  );

  const storageService: StorageService = new StorageService();

  useEffect(() => {
    if (state.user?.token && mount) {
      setRedirect(false);
    }

    if (!state.user?.token) {
      setRedirect(true);
    }
  }, [state]);

  useEffect(() => {
    (async () => {
      const storage = await storageService.GetAllData();
      const sessionStorage = await storageService.GetAllData(true);

      if (!!(storage.auth?.token || sessionStorage.auth?.token)) {
        setRedirect(false);
      } else {
        setRedirect(true);
      }
    })();

      setMount(true);
  }, []);

  return (props: any) =>
    redirect ? (
      <Navigate
        to={antiAuthRouteProps.redirectTo ?? "/authentication?mode=login"}
      />
    ) : (
      <WrappedComponent {...props} />
    );
};

export default AuthRoute;
