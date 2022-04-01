import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../@components/Header/Header";
import UserService from "../../@tentac/services/user-service/user-service";
import {
  IAuthUser,
  IBackendUser,
  IUserInfo,
} from "../../@tentac/types/auth/authTypes";
import { getCurrentUser, makeAssetUrl } from "../../utils/Utils";
import "./ExplorePage.scss";

export default function ExplorePage() {
  let isUnmounted = false;
  const [authUser, setAuthUser] = useState<IAuthUser | null>();
  const [users, setUsers] = useState<IBackendUser[]>();

  useEffect(() => {
    let isUnmounted = false;
    const userService: UserService = new UserService();

    (async () => {
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

  return (
    <div className="p-3">
      <Header />
      <div className="profiles-container py-5 flex justify-center">
        {users?.length == 0 ? (
          <h1 className="w-full text-center text-3xl my-10 font-bold">Heçkim tapılmadı :/</h1>
        ) : (
          users?.map((user, index) => (
            <Link to={`/user-details/${user.id}`} key={index}>
              <div className="profile-item relative shadow-lg">
                <div className="image-container w-full h-full relative rounded-md overflow-hidden">
                  <img
                    src={`${makeAssetUrl(
                      `${user.profilePhoto}`,
                      `media/profiles`
                    )}`}
                    className="w-full h-full object-cover absolute top-0 left-0 z-20"
                  />
                </div>
                <span className="z-10 absolute -bottom-2 text-center w-full translate-y-full text-md font-medium">
                  {user.name} {user.surname}
                </span>
                <div className="user-actions-carousel absolute right-0 top-0 z-10">
                  <div className="user-actions rounded-md flex flex-col">
                    <button className="action-button flex items-center justify-center rounded-full">
                      <i className="bi bi-person-plus-fill"></i>
                    </button>
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
