import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenticationPage } from "../../pages";
import Home from "../../pages/Home/Home";

export default function GeneralRoutes(props: any) {
  return (
    <BrowserRouter>
      <Routes {...props}>
        <Route path="/" element={<Home />}></Route>
        <Route path="/authentication" element={<AuthenticationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
