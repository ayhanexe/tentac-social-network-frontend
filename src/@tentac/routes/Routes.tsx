import React from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AntiAuthRoute from "../../@components/antiAuthorizationRoute/AntiAuthRoute";
import { AuthenticationPage } from "../../pages";
import Home from "../../pages/Home/Home";

export default function GeneralRoutes(props: any) {
  const AuthenticationRoute = AntiAuthRoute(() => <AuthenticationPage />, {
    redirectTo: "/",
  });
  useEffect(() => {}, []);

  return (
    <BrowserRouter>
      <Routes {...props}>
        <Route path="/" element={<Home />}></Route>
        <Route path="/authentication" element={<AuthenticationRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
