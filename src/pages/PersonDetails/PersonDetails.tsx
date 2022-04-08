import { merge } from "lodash";
import path from "path-browserify";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../@components/Header/Header";
import Profile from "../../@components/Profile/Profile";
import PostComponent from "../../@components/ReplyComponent/PostComponent";
import UserService from "../../@tentac/services/user-service/user-service";
import { IAuthUser, IBackendUser } from "../../@tentac/types/auth/authTypes";
import { getCurrentUser, makeAssetUrl } from "../../utils/Utils";

import "./PersonDetails.scss";

function PersonDetails() {
  let isUnmounted: boolean = false;
  const { id } = useParams();
  const [user, setUser] = useState<IAuthUser>();
  const [profileUser, setProfileUser] = useState<IBackendUser>();
  const userService: UserService = new UserService();

  useEffect(() => {
    (async () => {
      const authUser = await getCurrentUser();

      if (authUser && !isUnmounted && id) {
        setUser(authUser);

        const user = await userService.get(id, {
          bearerToken: authUser.token,
          token: authUser.token,
        });

        if (user && !isUnmounted) setProfileUser(user);
      }
    })();

    return () => {
      isUnmounted = true;
    };
  }, []);

  return (
    <div className="p-5">
      <Header />
      {profileUser && user ? (
        <div className="flex flex-col">
          <div id="wall" className="w-full overflow-hidden rounded-md mt-5">
            <img
              src={makeAssetUrl(`${profileUser.userWall}`, "media/walls")}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="flex gap-10">
            <Profile
              radius="250px"
              imageUrl={
                makeAssetUrl(`${profileUser.profilePhoto}`, "media/profiles") ??
                null
              }
              letters={profileUser.letters}
              circleClass="-translate-y-1/4 ml-10 shadow-lg z-10"
              textClass="text-6xl"
              defaultIconClass="text-6xl"
              hasStory={true}
            />
            <h1 className="text-4xl font-black mt-5">
              {profileUser?.name && profileUser?.surname ? (
                `${profileUser.name} ${profileUser.surname}`
              ) : profileUser?.userName ? (
                profileUser.userName
              ) : (
                <></>
              )}
            </h1>
          </div>
          <div className="flex flex-col">
            {profileUser.userPosts.map((data: any, index: number) => {
              return (
                <PostComponent
                  key={index}
                  data={merge(data.post, {
                    user: profileUser,
                  })}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h1>sdasdas</h1>
      )}
    </div>
  );
}

export default PersonDetails;
