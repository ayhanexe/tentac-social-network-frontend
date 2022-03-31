import { sortBy } from "lodash";
import path from "path-browserify";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../../@components/Header/Header";
import Profile from "../../@components/Profile/Profile";
import { defaultPostLength } from "../../@tentac/constants/config.constants";
import { RootState } from "../../@tentac/redux/store";
import { IAuthenticationServiceState } from "../../@tentac/services/authentication-service/state/Authentication.state.types";
import UserService from "../../@tentac/services/user-service/user-service";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import { IPost } from "../../@tentac/types/auth/userTypes";
import { getCurrentUser } from "../../utils/Utils";
import "./ProfilePage.scss";

export default function ProfilePage() {
  let isUnmounted = false;
  const [textarea, setTextarea] = useState<string>();
  const [user, setUser] = useState<IAuthUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [wallPhoto, setWallPhoto] = useState<string>();
  const [letters, setLetters] = useState<string>();
  const [posts, setPosts] = useState<IPost>();

  const handleTextarea = (e: BaseSyntheticEvent) =>
    e.target.value.length <= defaultPostLength
      ? setTextarea(e.target.value)
      : null;

  useEffect(() => {
    if (!isUnmounted) {
      (async () => {
        const _user = await getCurrentUser();
        if (_user) setUser(_user);
      })();
    }
    return () => {
      isUnmounted = true;
    };
  }, []);

  useEffect(() => {
    if (!isUnmounted) {
      (async () => {
        if (user) {
          if (user.name && user.surname) {
            setLetters(`${user.name[0]}${user.name[0]}`);
          }
        }
      })();
    }

    if (user?.profilePhotoUrl) {
      setProfilePhoto(user.profilePhotoUrl);
    }

    if (user?.userWall) {
      setWallPhoto(user.userWall);
    }
  }, [user]);

  return (
    <div className="m-5 flex flex-col gap-4">
      {user ? <Header /> : <></>}
      <main>
        <div id="wall" className="w-full rounded-lg overflow-hidden">
          <img
            src={path.join(
              `${process.env.REACT_APP_STATIC_FILES_BASE}`,
              `media/walls`,
              `${wallPhoto}`
            )}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <Profile
          radius="250px"
          imageUrl={profilePhoto ?? null}
          letters={letters}
          circleClass="-translate-y-1/4 ml-10 shadow-lg z-10"
          textClass="text-6xl"
          defaultIconClass="text-6xl"
          hasStory={true}
        />
        <div id="content-area" className="w-full">
          <h1 className="ml-80 text-4xl font-black mb-32">
            {user?.name && user?.surname ? (
              `${user.name} ${user.surname}`
            ) : user?.userName ? (
              user.userName
            ) : (
              <></>
            )}
          </h1>

          <div className="flex gap-3 items-start">
            {/* Post Area */}
            <div className="w-full flex flex-col">
              <div
                id="post-area"
                className="w-full bg-white/90 pt-3 pb-5 px-4 rounded-xl flex flex-col gap-4"
              >
                <h1 className="text-xl font-semibold">Post Something</h1>
                <div className="flex gap-5">
                  <Profile
                    radius="60px"
                    imageUrl={profilePhoto ?? null}
                    letters={letters}
                    hasStory={true}
                    storyBorderWidth="6px"
                    defaultIconClass="text-2xl"
                  />
                  <div className="flex flex-col w-full items-end">
                    <textarea
                      id="post-textarea"
                      placeholder="Hi all"
                      className="outline-none w-full mt-3 font-normal"
                      onChange={handleTextarea}
                      value={textarea}
                    />
                    <div className="flex items-center w-full justify-end mt-5 gap-5">
                      <span
                        className={`${
                          textarea?.length === defaultPostLength
                            ? "text-red-600/70"
                            : ""
                        } font-medium`}
                      >
                        {textarea?.length ?? 0}/{defaultPostLength}
                      </span>
                      <button className="text-black text-xl">
                        <i className="bi bi-paperclip"></i>
                      </button>
                      <button
                        id="post-button"
                        className="rounded-md bg-blue-700/90 px-5 py-2 shadow-md text-white flex items-center content-center gap-1"
                      >
                        <i className="bi bi-send-fill"></i>
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <h1
                id="nothing-message"
                className="text-center mt-20 text-3xl font-bold text-black/50"
              >
                Nothing to see here :/
              </h1>
            </div>
            {/* Post Area End */}
            <div
              id="recommendations"
              className="w-1/3 bg-white rounded-md p-3 flex flex-col"
            >
              <h1 className="text-xl font-semibold">Recommendations</h1>

              <div className="items flex flex-col gap-5 mt-5">
                <Link to="">
                  <div className="user-container flex items-center gap-2">
                    <Profile
                      radius="50px"
                      imageUrl={profilePhoto ?? null}
                      letters={letters}
                      hasStory={true}
                      storyBorderWidth="6px"
                    />
                    <h1 className="text-sm font-medium">Ayxan Abdullayev</h1>
                  </div>
                </Link>
                <Link to="">
                  <div className="user-container flex items-center gap-2">
                    <Profile radius="50px" letters={`SE`} />
                    <h1 className="text-sm font-medium">Steve Enderson</h1>
                  </div>
                </Link>
                <Link to="">
                  <div className="user-container flex items-center gap-2">
                    <Profile radius="50px" letters={`JS`} />
                    <h1 className="text-sm font-medium">Judy Shepherd</h1>
                  </div>
                </Link>
                <Link to="">
                  <div className="user-container flex items-center gap-2">
                    <Profile radius="50px" letters={`JS`} />
                    <h1 className="text-sm font-medium">Judy Shepherd</h1>
                  </div>
                </Link>
                <Link to="">
                  <div className="user-container flex items-center gap-2">
                    <Profile radius="50px" letters={`JS`} />
                    <h1 className="text-sm font-medium">Judy Shepherd</h1>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
