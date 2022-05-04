import path from "path-browserify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../@components/Header/Header";
import Profile from "../../@components/Profile/Profile";
import UserService from "../../@tentac/services/user-service/user-service";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import { getCurrentUser } from "../../utils/Utils";

const FriendsPage = () => {
  let unmounted = false;
  const userService: UserService = new UserService();
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const _user = await getCurrentUser();
      if (_user && !unmounted) {
        console.log(_user)
        _user.friends.map(async (data: any, index: number) => {
          const friend = await userService.get(data.friend, {
            bearerToken: `${_user.token}`,
          });

          if (friend) {
            setFriends([...friends, friend]);
          }
        });
        setUser(_user);
      }
    })();

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div className="p-5">
      <Header />
      <div className="mt-5">
        <h1 className="text-3xl font-bold">Your Friends</h1>
        <div className="users flex mt-3 gap-20 w-full">
          {user && friends.length > 0 ? (
            friends.map((data: any, index: number) => {
              return (
                <Link to={`/user-details/${data.id}`}>
                  <div key={index} className="user-item flex flex-col pt-20">
                    <Profile
                      radius="170px"
                      imageUrl={
                        data.profilePhoto
                          ? path.join(
                              `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                              "media/profiles",
                              `${data.profilePhoto}`
                            )
                          : null
                      }
                      letters={data.letters}
                      circleClass="-translate-y-1/4 shadow-lg z-10 cursor-pointer"
                      textClass="text-6xl"
                      defaultIconClass="text-6xl"
                      hasStory={user && user.userStories.length > 0}
                    />
                    <h4 className="text-2xl text-center">
                      {data.name == "" || data.surname == ""
                        ? data.userName
                        : `${data.name} ${data.surname}`}
                    </h4>
                  </div>
                </Link>
              );
            })
          ) : (
            <h1 className="text-4xl text-center block w-full mt-10 font-bold text-black/30">
              There is no friend yet!
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
