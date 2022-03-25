import React, { useEffect, useState } from "react";
import Header from "../../@components/Header/Header";
import { IUser } from "../../@tentac/types/auth/authTypes";
import {
  getCurrentUser,
  getUserProfilePhoto,
  getUserWallPhoto,
} from "../../utils/Utils";

export default function Home() {
  const [user, setUser] = useState<IUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [wallPhoto, setWallPhoto] = useState<string>();

  useEffect(() => {
    (async () => {
      const _user = await getCurrentUser();
      if (_user) {
        setUser(_user);
        setProfilePhoto(await getUserProfilePhoto(_user));
        setWallPhoto(await getUserWallPhoto(_user));
      }
    })();
  }, []);

  return (
    <div className="m-5 flex flex-col gap-4">
      <Header />
    </div>
  );
}
