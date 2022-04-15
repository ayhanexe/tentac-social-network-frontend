import "./Header.scss";

import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../utils/Utils";
import Profile from "../Profile/Profile";
import axios from "axios";
import path from "path-browserify";

export default function Header() {
  let unmounted = false;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [dropdownState, setDropdownState] = useState<boolean>(false);
  const [user, setUser] = useState<IAuthUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [friendRequests, setFriendRequests] = useState();

  const handleDropdownToggle = () =>
    !unmounted ? setDropdownState(!dropdownState) : null;

  useEffect(() => {
    if (user?.profilePhotoUrl) {
      setProfilePhoto(user.profilePhotoUrl);
    }
  }, [user]);

  useEffect(() => {
    if (!unmounted) {
      document.addEventListener("click", (e: Event) => {
        if (
          dropdownRef.current &&
          profileRef.current &&
          !e.composedPath().includes(dropdownRef.current) &&
          !e.composedPath().includes(profileRef.current) &&
          !unmounted
        ) {
          setDropdownState(false);
        }
      });

      (async () => {
        const _user = await getCurrentUser();
        const _friendRequests = await axios.get(path.join(`${process.env.REACT_APP_API_BASE}`, 'userFriendRequests'));
        console.log(_friendRequests)
        if (_user) {
          if (!unmounted) setUser(_user);
        }
      })();
    }

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <header
      id="header"
      className="py-3 px-5 rounded-lg shadow-md flex justify-between"
    >
      <Link to="/" className="h-full">
        <img src="/assets/media/tentac-logo-dark.svg" className="h-full" />
      </Link>

      <div id="user-area" className="flex items-center gap-3 relative">
        <div className="relative">
          <i className="bi bi-bell-fill text-xl text-gray-900/90 cursor-pointer"></i>
          <div
            id="notification-dropdown"
            className="bg-white rounded-md absolute shadow-md flex flex-col"
          >
            <a href="#">wqewqe</a>
          </div>
        </div>
        {user ? (
          <div id="message">
            {user.name
              ? `Hi, ${user.name}`
              : `Hi, ${user.userName}`
              ? `Hi, ${user.userName}`
              : ""}
          </div>
        ) : (
          <></>
        )}

        <Profile
          ref={profileRef}
          imageUrl={profilePhoto ?? null}
          letters={user?.letters}
          radius="50px"
          onClick={handleDropdownToggle}
          circleClass="cursor-pointer"
          defaultIconClass="text-xl"
        />

        <div
          ref={dropdownRef}
          id="profile-dropdown"
          className={`absolute shadow-xl right-0 rounded-md py-2 transition-all duration-300 ease-in-out z-50 ${
            dropdownState ? "open" : ""
          }`}
        >
          <Link
            className="w-full gap-3 dropdown-item flex items-center px-5 text-md font-medium hover:bg-black/5 transition-all ease-in-out duration-300"
            to="/profile"
          >
            <i className="bi bi-people-fill"></i>
            Profile
          </Link>
          <Link
            className="w-full gap-3 dropdown-item flex items-center px-5 text-md font-medium hover:bg-black/5 transition-all ease-in-out duration-300"
            to="/settings"
          >
            <i className="bi bi-gear-wide-connected"></i>
            Settings
          </Link>
          <Link
            className="w-full gap-3 dropdown-item flex items-center px-5 text-md font-medium hover:bg-black/5 transition-all ease-in-out duration-300"
            to="/logout"
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
}
