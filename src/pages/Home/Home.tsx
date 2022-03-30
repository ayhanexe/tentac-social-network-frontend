import React, { useEffect, useState } from "react";
import Header from "../../@components/Header/Header";
import HomeStoriesSlider from "../../@components/HomeStoriesSlider/HomeStoriesSlider";
import HomeUserInfo from "../../@components/HomeUserInfo/HomeUserInfo";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import {
  getCurrentUser,
  getUserProfilePhoto,
  getUserWallPhoto,
} from "../../utils/Utils";

export default function Home() {
  let unmounted = false;
  const [user, setUser] = useState<IAuthUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [wallPhoto, setWallPhoto] = useState<string>();

  useEffect(() => {
    (async () => {
      const _user = await getCurrentUser();
      if (_user) {
        if (!unmounted) setUser(_user);
        const photo = await getUserProfilePhoto(_user).catch(() => {});
        const wall = await getUserWallPhoto(_user).catch(() => {});

        if (photo && !unmounted) setProfilePhoto(photo);
        if (wall && !unmounted) setWallPhoto(wall);
      }
    })();

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div className="m-5 flex flex-col gap-4">
      <Header />
      <div className="flex items-start">
        <HomeUserInfo />
        <div className="w-full flex flex-col px-3">
          <HomeStoriesSlider />
        </div>
      </div>
    </div>
  );
}
