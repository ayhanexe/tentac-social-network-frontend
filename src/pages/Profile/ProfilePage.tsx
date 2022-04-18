import path from "path-browserify";
import { BaseSyntheticEvent, memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../@components/Header/Header";
import Profile from "../../@components/Profile/Profile";
import PostComponent from "../../@components/ReplyComponent/PostComponent";
import { defaultPostLength } from "../../@tentac/constants/config.constants";
import { AlertService } from "../../@tentac/services";
import PostService from "../../@tentac/services/postService/PostService";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import { IPost } from "../../@tentac/types/auth/userTypes";
import { getCurrentUser, removeHtmlTagsFromString } from "../../utils/Utils";
import * as ConfigConstants from "../../@tentac/constants/config.constants";
import "./ProfilePage.scss";
import PopupAlertService from "../../@tentac/services/popup-alert-service/PopupAlertService";

const { CKEditor } = require("@ckeditor/ckeditor5-react");
const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

function ProfilePage() {
  let isUnmounted = false;

  const [hasAlert, setHasAlert] = useState<boolean>(false);
  const [textarea, setTextarea] = useState<string>("");
  const [textAreaForLetters, settextAreaForLetters] = useState<string>("");
  const [user, setUser] = useState<IAuthUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [wallPhoto, setWallPhoto] = useState<string>();
  const [letters, setLetters] = useState<string>();
  const [posts, setPosts] = useState<IPost>();
  const [postData, setPostData] = useState<IPost[]>([]);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [isFocusing, setIsFocusing] = useState<boolean>(false);

  const alertService: AlertService = new AlertService();
  const PopupService: PopupAlertService = new PopupAlertService();
  const Alert = PopupService.Invoke();
  console.log(Alert)

  const handlePost = () => {
    if (!textarea || (textarea && textarea.length == 0)) {
      alertService.Error({
        text: "Please type something before post!",
      });
    } else {
      const postService: PostService = new PostService();
      setTextarea("");

      if (user) {
        postService
          .create(
            {
              text: `${textarea}`,
              userId: user?.id,
              isDeleted: false,
              postLikes: [],
              postReplies: [],
            },
            {
              bearerToken: user.token,
              token: user.token,
            }
          )
          .then(async () => {
            const data = await postService.getAll({
              bearerToken: `${user.token}`,
              token: `${user.token}`,
            });
            if (data)
              setPostData([...data.filter((d) => d.user?.id == user.id)]);
          });
      }
    }
  };

  const handleDelete = (data: any) => {
    setPostData([...postData.filter((d) => d.id != data.id)]);
  };

  useEffect(() => {
    if (!isUnmounted) {
      (async () => {
        const postService: PostService = new PostService();
        const _user = await getCurrentUser();

        if (_user) {
          const response = await postService.getAll({
            bearerToken: `${_user?.token}`,
            token: `${_user?.token}`,
          });

          if (response) {
            const newResponse = [
              ...response.filter((r) => {
                if (r.user?.id === _user.id) return r;
              }),
            ];
            setPostData(newResponse);
          }
          setUser(_user);
        }
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

  return user ? (
    <div className="m-5 flex flex-col gap-4">
      {user ? <Header /> : <></>}
      <main>
        <div id="wall" className="w-full rounded-lg overflow-hidden">
          <img
            src={path.join(
              `${process.env.REACT_APP_STATIC_FILES_BASE}`,
              `media/walls`,
              `${wallPhoto ?? ConfigConstants.defaultWallPhotoName}`
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

          <div className="w-full flex gap-3 items-start">
            {/* Post Area */}
            <div className="flex w-full flex-col">
              <div
                id="post-area"
                className="w-full bg-white/90 pt-3 pb-5 px-4 rounded-xl flex flex-col gap-4"
              >
                <h1 className="text-xl font-semibold">Post Something</h1>
                <div className="flex">
                  <Profile
                    radius="60px"
                    imageUrl={profilePhoto ?? null}
                    letters={letters}
                    hasStory={true}
                    storyBorderWidth="6px"
                    defaultIconClass="text-2xl"
                  />
                  <div className="flex flex-col w-full items-end pl-3">
                    <CKEditor
                      editor={ClassicEditor}
                      data="<p>Type something...</p>"
                      onKeyDown={() => console.log("asdwq")}
                      onChange={(event: any, editor: any) => {
                        if (!isInitial || isFocusing) {
                          const simpleText = removeHtmlTagsFromString(
                            editor.getData()
                          );
                          if (simpleText.length <= defaultPostLength) {
                            setTextarea(editor.getData());
                            settextAreaForLetters(simpleText);
                          } else {
                            editor.setData(textarea);
                          }
                        }
                      }}
                      onFocus={(event: any, editor: any) => {
                        setIsFocusing(true);
                        setTextarea("");
                        editor.setData(textarea);
                      }}
                      onBlur={(event: any, editor: any) => {
                        setIsFocusing(false);
                        if (textarea == "") {
                          setTextarea("");
                          editor.setData("Type something...");
                        }
                      }}
                    />
                    <div className="flex items-center w-full justify-end mt-5 gap-5">
                      <span
                        className={`${
                          textAreaForLetters?.length === defaultPostLength
                            ? "text-red-600/70"
                            : ""
                        } font-medium`}
                      >
                        {textAreaForLetters?.length ?? 0}/{defaultPostLength}
                      </span>
                      <button className="text-black text-xl">
                        <i className="bi bi-paperclip"></i>
                      </button>
                      <button
                        onClick={handlePost}
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

              {postData.length > 0 ? (
                postData.map((data, index) => {
                  return (
                    <PostComponent
                      onDelete={handleDelete}
                      key={index}
                      data={data}
                    />
                  );
                })
              ) : (
                <h1
                  id="nothing-message"
                  className="text-center mt-20 text-3xl font-bold text-black/50"
                >
                  Nothing to see here :/
                </h1>
              )}
            </div>
            {/* Post Area End */}

            <div
              id="recommendations"
              className="w-1/3 bg-white rounded-md p-3 hidden lg:flex flex-col"
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
  ) : (
    <h1>Loading...</h1>
  );
}

export default memo(ProfilePage);
