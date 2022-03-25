import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logout } from "../../@tentac/services/authentication-service/state/Authentication.actions";
import StorageService from "../../@tentac/services/storage-service/StorageService";

export default function Logout() {
  const [isThat, setIsThat] = useState<boolean>(false);
  const dispatch = useDispatch();
  const storageService: StorageService = new StorageService();

  useEffect(() => {
    (async () => {
      await storageService.DestroyData();
      await storageService.DestroyData(false);
    })()
    dispatch(logout());
    setIsThat(true);
  }, []);

  return isThat ? (
    <Navigate to="/authentication?mode=login" />
  ) : (
    <div>Logging out...</div>
  );
}
