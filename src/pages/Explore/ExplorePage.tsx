import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../@components/Header/Header";
import UserService from "../../@tentac/services/user-service/user-service";
import {
  IAuthUser,
  IBackendUser,
  IUserInfo,
} from "../../@tentac/types/auth/authTypes";
import { getCurrentUser, makeAssetUrl } from "../../utils/Utils";
import * as ConfigConstants from "../../@tentac/constants/config.constants";
import "./ExplorePage.scss";
import axios from "axios";
import path from "path-browserify";

export default function ExplorePage() {
  let isUnmounted = false;
  const [authUser, setAuthUser] = useState<IAuthUser | null>();
  const [users, setUsers] = useState<IBackendUser[]>();
  const [friendRequests, setFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    let isUnmounted = false;
    const userService: UserService = new UserService();

    (async () => {
      const friendRequests = await axios.get(
        path.join(`${process.env.REACT_APP_API_BASE}`, "UserFriendRequests"),
        {
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
        }
      );

      if (friendRequests.data.length > 0 && !isUnmounted)
        setFriendRequests(friendRequests.data);

      const _user: IAuthUser | null = await getCurrentUser();
      if (!isUnmounted) setAuthUser(_user);

      if (_user) {
        const users = await userService.getAll({
          bearerToken: `${_user.token}`,
        });

        if (users && !isUnmounted) {
          setUsers(users.filter((user) => user.id != _user?.id));
        }
      }
    })();

    return () => {
      isUnmounted = true;
    };
  }, []);

  const handleUserUnfriendRequest = async (
    userId: string,
    e: BaseSyntheticEvent
  ) => {
    e.preventDefault();
    const request = friendRequests.filter(
      (f) => f?.friendRequestedUser?.id == authUser?.id && f?.user?.id == userId
    );
    if (request.length > 0) {
      await axios
        .delete(
          path.join(
            `${process.env.REACT_APP_API_BASE}`,
            "UserFriendRequests",
            `${request[0].id}`
          ),
          {
            headers: {
              Authorization: `Bearer ${authUser?.token}`,
            },
          }
        )
        .then(() => {
          console.log("Request deleted successfully!");
          if (!isUnmounted)
            setFriendRequests({
              ...friendRequests.filter(
                (f) =>
                  f?.friendRequestedUser?.id != authUser?.id &&
                  f?.user?.id != userId
              ),
            });
        })
        .catch(() => console.log("can't delete friend request!"));
    }
  };

  const handleUserFriendRequest = async (
    userId: string,
    e: BaseSyntheticEvent
  ) => {
    e.preventDefault();
    await axios
      .post(
        path.join(`${process.env.REACT_APP_API_BASE}`, "UserFriendRequests"),
        {
          UserId: `${userId}`,
          FriendId: `${authUser?.id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${authUser?.token}`,
          },
        }
      )
      .then(async () => {
        console.log("Friend request sended successfully!");
        const requests = await axios.get(
          path.join(`${process.env.REACT_APP_API_BASE}`, "UserFriendRequests"),
          {
            headers: {
              Authorization: `Bearer ${authUser?.token}`,
            },
          }
        );
        if (!isUnmounted) setFriendRequests([...requests.data]);
      })
      .catch(() => console.log("can't send friend request!"));
  };

  return (
    <div className="p-3">
      <Header />
      <div className="profiles-container py-5 flex justify-center">
        {users?.length == 0 ? (
          <h1 className="w-full text-center text-3xl my-10 font-bold">
            Heçkim tapılmadı :/
          </h1>
        ) : (
          users?.map((user, index) => (
            <Link
              to={`/user-details/${user.id}`}
              key={index}
              className="relative"
              style={{
                zIndex: Math.round(users.length - index),
              }}
            >
              <div className="profile-item relative shadow-lg z-10">
                <div className="image-container w-full h-full relative rounded-md overflow-hidden flex justify-center items-center z-20">
                  {user?.friends?.filter(
                    (friend) =>
                      friend.friend == authUser?.id ||
                      friend.user == authUser?.id
                  ).length > 0 ? (
                    <div className="absolute top-0 left-0 w-full py-2 bg-green-300 text-center font-bold z-40">
                      FRIEND
                    </div>
                  ) : null}
                  {user.profilePhoto ? (
                    <img
                      src={makeAssetUrl(
                        `${user.profilePhoto}`,
                        `media/profiles`
                      )}
                      className="w-full h-full object-cover absolute top-0 left-0 z-20"
                    />
                  ) : (
                    <i className="bi bi-people-fill text-4xl" />
                  )}
                </div>
                <span className="z-10 absolute -bottom-2 text-center w-full translate-y-full text-md font-medium">
                  {user.name == "" || user.surname == ""
                    ? user.userName
                    : `${user.name} ${user.surname}`}
                </span>
                <div className="user-actions-carousel absolute right-0 top-0 z-10">
                  <div className="user-actions rounded-md flex flex-col">
                    {user.friends.filter(
                      (friend) =>
                        friend.friend == authUser?.id ||
                        friend.user == authUser?.id
                    ).length == 0 ? (
                      friendRequests.length > 0 ? (
                        friendRequests?.filter(
                          (f) =>
                            f?.friendRequestedUser?.id == authUser?.id &&
                            f?.user?.id == user?.id
                        ).length > 0 ? (
                          <button
                            onClick={(e) =>
                              handleUserUnfriendRequest(user.id, e)
                            }
                            className="action-button flex items-center justify-center rounded-full z-50 relative"
                          >
                            <i className="bi bi-person-dash-fill relative z-50"></i>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleUserFriendRequest(user.id, e)}
                            className="action-button flex items-center justify-center rounded-full z-50 relative"
                          >
                            <i className="bi bi-person-plus-fill relative z-50"></i>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={(e) => handleUserFriendRequest(user.id, e)}
                          className="action-button flex items-center justify-center rounded-full z-50 relative"
                        >
                          <i className="bi bi-person-plus-fill relative z-50"></i>
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
