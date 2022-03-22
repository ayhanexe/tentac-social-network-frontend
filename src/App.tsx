import { useEffect } from "react";
import { Routes } from "./@tentac";
import StorageService from "./@tentac/services/storage-service/StorageService";

function App() {
  const storageService = new StorageService();

  useEffect(() => {
    (async () => {
      await storageService.TestData();
    })();
  }, []);

  return (
    <div id="App">
      <Routes />
    </div>
  );
}

export default App;
