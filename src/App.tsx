import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AuthenticationService, Routes } from "./@tentac";
import { authenticationService } from "./@tentac/services/authentication-service";
import StorageService from "./@tentac/services/storage-service/StorageService";

function App() {
  const storageService: StorageService = new StorageService();
  const authenticationService: authenticationService =
    new AuthenticationService();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await storageService.TestData();
      await authenticationService.Initialize(dispatch);
    })();
  }, []);

  return (
    <div id="App">
      <Routes />
    </div>
  );
}

export default App;
