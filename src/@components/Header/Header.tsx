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
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLElement>(null);
  const [dropdownState, setDropdownState] = useState<boolean>(false);
  const [notificationDropdownState, setNotificationDropdownState] =
    useState<boolean>(false);
  const [user, setUser] = useState<IAuthUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState();

  const handleDropdownToggle = () =>
    !unmounted ? setDropdownState(!dropdownState) : null;

  const handleNotificationDropdownToggle = () =>
    !unmounted
      ? setNotificationDropdownState(!notificationDropdownState)
      : null;

  useEffect(() => {
    if (user?.profilePhotoUrl && !unmounted) {
      setProfilePhoto(user.profilePhotoUrl);
    }
  }, [user]);

  useEffect(() => {
    if (!unmounted) {
      document.addEventListener("click", (e: Event) => {
        if (
          notificationDropdownRef.current &&
          bellRef.current &&
          !e.composedPath().includes(notificationDropdownRef.current) &&
          !e.composedPath().includes(bellRef.current) &&
          !unmounted
        ) {
          setNotificationDropdownState(false);
        }
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
        const _friendRequests = await axios.get(
          path.join(`${process.env.REACT_APP_API_BASE}`, "userFriendRequests"),
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (!unmounted) setFriendRequests(_friendRequests.data);
        if (_user) {
          if (!unmounted) setUser(_user);
        }
      })();
    }

    return () => {
      unmounted = true;
    };
  }, []);

  const acceptUserRequest = async (id: any) => {
    if (id) {
      await axios
        .post(
          path.join(
            `${process.env.REACT_APP_API_BASE}`,
            "userFriendRequests",
            "Accept",
            id
          ),
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        )
        .then(() => {
          if (!unmounted) {
            setFriendRequests([
              ...friendRequests.filter((request: any) => request.id != id),
            ]);
          }
        });
    }
  };
  const declineUserRequest = async (id: any) => {
    if (id) {
      await axios
        .post(
          path.join(
            `${process.env.REACT_APP_API_BASE}`,
            "userFriendRequests",
            "Decline",
            id
          ),
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        )
        .then(() => {
          if (!unmounted) {
            setFriendRequests([
              ...friendRequests.filter((request: any) => request.id != id),
            ]);
          }
        });
    }
  };

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
          <i
            ref={bellRef}
            onClick={handleNotificationDropdownToggle}
            className="bi bi-bell-fill text-xl text-gray-900/90 cursor-pointer relative"
          >
            {user &&
            friendRequests?.filter((d: any) => d?.user?.id == user?.id)?.length >
              0 ? (
              <div className="rounded-full notification-number bg-white absolute flex items-center justify-center text-xs not-italic font-bold">
                {
                  friendRequests?.filter((d: any) => d?.user?.id == user?.id)
                    ?.length
                }
              </div>
            ) : null}
          </i>
          <div
            ref={notificationDropdownRef}
            id="notification-dropdown"
            className={`bg-white rounded-md absolute shadow-md flex flex-col right-0 p-2 ${
              notificationDropdownState ? "" : "hidden"
            }`}
            style={{
              zIndex: 999999999,
            }}
          >
            <h1 className="text-xl font-bold mb-3">Notifications</h1>
            {/*  */}
            {friendRequests?.filter(
              (d: any) => d?.friendRequestedUser?.id != user?.id
            )?.length == 0 && user?.notifications.length == 0 ? (
              <h1 className="font-bold text-2xl text-center mb-3 text-black/20 select-none">
                Empty
              </h1>
            ) : (
              <>
                {user?.notifications.map((notification: any, index: number) => {
                  return notification.userId ? (
                    <Link
                      key={index}
                      to={`/user-details/${notification.userId}`}
                    >
                      <div
                        key={`notification-${index}`}
                        dangerouslySetInnerHTML={{
                          __html: `${notification.text}`,
                        }}
                      ></div>
                    </Link>
                  ) : (
                    <div
                      key={`notification-${index}`}
                      dangerouslySetInnerHTML={{
                        __html: `${notification.text}`,
                      }}
                    ></div>
                  );
                })}
                {friendRequests
                  ?.filter((d: any) => d?.user?.id == user?.id)
                  ?.map((item: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="notification-container w-full rounded-md py-5 px-2 flex flex-wrap gap-2 justify-between items-center"
                      >
                        <span className="select-none">
                          <Link
                            to={path.join(
                              "/",
                              path.join(
                                "user-details",
                                `${item?.friendRequestedUser?.id}`
                              )
                            )}
                          >
                            <b>
                              {item?.friendRequestedUser?.name == "" ||
                              item?.friendRequestedUser?.surname == ""
                                ? item?.friendRequestedUser?.userName
                                : `${item?.friendRequestedUser?.name} ${item?.friendRequestedUser?.surname}`}
                            </b>
                          </Link>
                          &nbsp; sended friend request
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={async () =>
                              await acceptUserRequest(item.id)
                            }
                            className="rounded-md bg-lime-400 px-3 py-1 font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () =>
                              await declineUserRequest(item.id)
                            }
                            className="rounded-md bg-red-500 px-3 py-1 font-medium"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
            {/*  */}
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
