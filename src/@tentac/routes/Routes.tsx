import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenticationPage } from "../../pages";

export default function GeneralRoutes(props: any) {
  return (
    <BrowserRouter>
      <Routes {...props}>
        <Route path="/" element={<AuthenticationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
