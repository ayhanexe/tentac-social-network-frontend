import { memo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AntiAuthRoute from "../../@components/antiAuthorizationRoute/AntiAuthRoute";
import AuthRoute from "../../@components/authorizationRoute/AuthorizationRoute";
import { AuthenticationPage } from "../../pages";
import Home from "../../pages/Home/Home";
import Logout from "../../pages/Logout/Logout";
import ProfilePage from "../../pages/Profile/ProfilePage";

function GeneralRoutes(props: any) {
  const AuthenticationRoute = memo(
    AntiAuthRoute(() => <AuthenticationPage />, {
      redirectTo: "/",
    })
  );

  const HomeRoute = memo(
    AuthRoute(() => <Home />, {
      redirectTo: "/authentication?mode=login",
    })
  );

  const ProfileRoute = memo(AuthRoute(() => <ProfilePage></ProfilePage>));

  return (
    <BrowserRouter>
      <Routes {...props}>
        <Route path="/" element={<HomeRoute />}></Route>
        <Route path="/authentication" element={<AuthenticationRoute />} />
        <Route path="/profile" element={<ProfileRoute />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default memo(GeneralRoutes);
