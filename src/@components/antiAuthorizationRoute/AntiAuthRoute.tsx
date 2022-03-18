import { ComponentType, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../@tentac/redux/store";
import { IAuthenticationServiceState } from "../../@tentac/services/authentication-service/state/Authentication.state.types";
import { IAntiAuthRoute } from "./AntiAuthRoute.types";

const AntiAuthRoute = <P,>(
  WrappedComponent: ComponentType<P>,
  antiAuthRouteProps: IAntiAuthRoute
) => {
  const state: IAuthenticationServiceState = useSelector(
    (state: RootState) => state.auth
  );
  
  return (props: P) =>
    state.user && state.user.token ? (
      <Navigate to={antiAuthRouteProps.redirectTo ?? "/"} />
    ) : (
      <WrappedComponent {...props} />
    );
};

export default AntiAuthRoute;
