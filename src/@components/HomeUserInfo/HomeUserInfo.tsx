import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import { getCurrentUser } from "../../utils/Utils";
import Profile from "../Profile/Profile";
import "./HomeUserInfo.scss";

export default function HomeUserInfo() {
  let unmounted = false;
  const [user, setUser] = useState<IAuthUser>();
  const [profileImage, setProfileImage] = useState<string>();

  useEffect(() => {
    if (user?.profilePhotoUrl) {
      setProfileImage(user.profilePhotoUrl)
    }
  }, [user]);
  
  useEffect(() => {
    if (!unmounted) {
      (async () => {
        const user = await getCurrentUser();
        if (user) {
          if (!unmounted) {
            setUser(user);
          }
        }
      })();
    }

    return () => {
      unmounted = true;
    };
  }, []);


  return (
    <div
      id="home-user-info"
      className="rounded-md shadow-md p-2 flex flex-col gap-2"
    >
      <div
        id="user-info-container"
        className="w-full rounded-md flex items-center gap-3 p-2"
      >
        <Profile
          radius="70px"
          letters={user?.letters}
          imageUrl={profileImage}
          defaultIconClass="text-3xl"
        />
        <div className="flex flex-col">
          <h5 className="text-lg font-medium">
            {user
              ? user?.name && user?.surname
                ? `${user.name} ${user.surname}`
                : `${user.email ? user.email : ""}`
              : ""}
          </h5>
          <h6 className="text-xs font-medium">
            {user?.userName ? `@${user?.userName}` : ""}
          </h6>
        </div>
      </div>
      <Link
        className="gap-2 home-user-info-item w-full flex items-center py-2 px-3 rounded-md font-medium text-md transition-colors ease-in-out duration-300 hover:bg-slate-100/70"
        to="/profile"
      >
        <i className="bi bi-person-fill"></i>
        Profile
      </Link>
      <Link
        className="gap-2 home-user-info-item w-full flex items-center py-2 px-3 rounded-md font-medium text-md transition-colors ease-in-out duration-300 hover:bg-slate-100/70"
        to="/friends"
      >
        <i className="bi bi-people-fill"></i>
        Friends
      </Link>
      <Link
        className="gap-2 home-user-info-item w-full flex items-center py-2 px-3 rounded-md font-medium text-md transition-colors ease-in-out duration-300 hover:bg-slate-100/70"
        to="/explore"
      >
        <i className="bi bi-globe2"></i>
        Explore
      </Link>
      <Link
        className="gap-2 home-user-info-item w-full flex items-center py-2 px-3 rounded-md font-medium text-md transition-colors ease-in-out duration-300 hover:bg-slate-100/70"
        to="/settings"
      >
        <i className="bi bi-sliders"></i>
        Settings
      </Link>
    </div>
  );
}
