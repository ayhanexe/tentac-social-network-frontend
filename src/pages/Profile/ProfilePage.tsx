import path from "path-browserify";
import React, {
  BaseSyntheticEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import Header from "../../@components/Header/Header";
import Profile from "../../@components/Profile/Profile";
import PostComponent from "../../@components/ReplyComponent/PostComponent";
import { defaultPostLength } from "../../@tentac/constants/config.constants";
import { AlertService } from "../../@tentac/services";
import PostService from "../../@tentac/services/postService/PostService";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import { IPost } from "../../@tentac/types/auth/userTypes";
import {
  getCurrentUser,
  removeHtmlTagsFromString,
  sleep,
} from "../../utils/Utils";
import * as ConfigConstants from "../../@tentac/constants/config.constants";
import "./ProfilePage.scss";
import PopupAlertService from "../../@tentac/services/popup-alert-service/PopupAlertService";

import TinySlider from "tiny-slider-react";
import "tiny-slider/dist/tiny-slider.css";

const { CKEditor } = require("@ckeditor/ckeditor5-react");
const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

function ProfilePage() {
  let isUnmounted = false;

  const [textarea, setTextarea] = useState<string>("");
  const [textAreaForLetters, settextAreaForLetters] = useState<string>("");
  const [user, setUser] = useState<IAuthUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [wallPhoto, setWallPhoto] = useState<string>();
  const [letters, setLetters] = useState<string>();
  const [postData, setPostData] = useState<IPost[]>([]);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [hasPopup, setHasPopup] = useState<boolean>(false);
  const storyTimelineRef = useRef<HTMLDivElement>(null);
  const [item, rerender] = useState<number>(0);
  const alertService: AlertService = new AlertService();
  const PopupService: PopupAlertService = new PopupAlertService();
  const tinySliderRef = useRef<any>(null);
  const userStoriesContainerRef = useRef<HTMLDivElement>(null);
  const [showStory, setShowStory] = useState<boolean>(true);
  const storyTimeout = 3000;
  const pauseRef = useRef<HTMLDivElement>(null);
  let storyInterval: NodeJS.Timer | null = null;
  let [slideIndex, setSlideIndex] = useState<number>(0);
  let [animateTimelineFunc, setAnimateTimelineFunc] =
    useState<AsyncGenerator | null>(null);
  const [clicking, setClicking] = useState<boolean>(false);
  const timeline = useRef(gsap.timeline({ paused: clicking }));

  useEffect(() => {
    document.addEventListener("click", async (e) => {
      if (
        !isUnmounted &&
        userStoriesContainerRef.current &&
        !e.composedPath().includes(userStoriesContainerRef.current)
      ) {
        setHasPopup(false);
        setShowStory(false);
        if (storyInterval) clearInterval(storyInterval);
      }
      //  else {
      //   const timelineItems = storyTimelineRef.current?.querySelectorAll(
      //     ".timeline-item"
      //   )
      //     ? [...storyTimelineRef.current?.querySelectorAll(".timeline-item")]
      //     : [];
      // }
    });
  }, []);

  const handleSeeStories = async () => {
    if (!isUnmounted) {
      await sleep(0);
      await PopupService.Hide();
      setHasPopup(false);
      setShowStory(true);

      if (storyTimelineRef.current) {
        const timelineItems = storyTimelineRef.current.querySelectorAll(
          ".timeline-item-inner-progress"
        );

        if (!isUnmounted) {
          const _timeline = animateTimeline([...timelineItems]);
          setAnimateTimelineFunc(_timeline);

          (async () => {
            await _timeline?.next();
          })();

          handleStoriesSlider();
        }
      }
    }
  };

  async function handleStoriesSlider() {
    if (storyInterval) clearInterval(storyInterval);
  }

  useEffect(() => {
    if (timeline.current) {
      timeline.current.then(async () => {
        if (!isUnmounted) setSlideIndex(slideIndex + 1);
        slideIndex += 1;
        if (animateTimelineFunc) await animateTimelineFunc.next();
      });
    }
  }, [timeline, animateTimelineFunc]);

  async function* animateTimeline(timelineItems: Element[]) {
    for (let i = 0; i < timelineItems.length; i++) {
      tinySliderRef.current?.slider?.goTo(i);
      if (!isUnmounted) setSlideIndex(i);

      timeline.current?.add(
        gsap.to(timelineItems[i], {
          width: "100%",
          duration: storyTimeout / 1000,
          ease: "linear",
        })
      );

      yield i;
    }
  }

  const Alert = PopupService.Invoke({
    title: "Select one",
    body: (
      <div
        className="flex flex-col justify-center items-center align-center h-full pt-5"
        style={{
          flex: "1 1 100%",
        }}
      >
        <a
          target="_blank"
          href={profilePhoto}
          className="py-1 px-2 text-center text-white rounded-md bg-black/50 my-2 w-2/4"
        >
          See Profile Image
        </a>
        <Link
          to={`/add-story/${user?.id}`}
          className="py-1 px-2 text-center text-white rounded-md bg-black/50 my-2 w-2/4"
        >
          Set Story
        </Link>
        <button
          onClick={handleSeeStories}
          className="py-1 px-2 text-center text-white rounded-md bg-black/50 my-2 w-2/4"
        >
          See Stories
        </button>
      </div>
    ),
    footer: (
      <div className="flex justify-center gap-3">
        <button
          onClick={() => PopupService.Hide()}
          className="uppercase opacity-50 hover:opacity-100 transition-opacity duration-300 ease-out bg-rose-600 py-1 px-2 rounded-md text-white"
        >
          Close
        </button>
      </div>
    ),
  });

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

  const handleProfileClick = () => {
    if (!isUnmounted) {
      PopupService.Show();
      setHasPopup(true);
    }
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

  const slidePrev = () => {
    if (slideIndex > 0) {
      slideIndex -= 1;
      setSlideIndex(slideIndex);
      tinySliderRef.current?.slider.goTo(slideIndex);
      const timelineItems = storyTimelineRef.current?.querySelectorAll(
        ".timeline-item-inner-progress"
      );

      if (timelineItems && timelineItems.length > 0) {
        const _a_timelineItems = [...timelineItems];
        timeline.current.clear();
        gsap.set(
          _a_timelineItems.slice(-(_a_timelineItems.length - slideIndex)),
          {
            width: "0",
          }
        );
        timeline.current?.add(
          gsap.to(_a_timelineItems[slideIndex], {
            width: "100%",
            duration: storyTimeout / 1000,
            ease: "linear",
          })
        );
        timeline.current.then(() => {
          slideIndex -= 1;
          tinySliderRef.current.slider.goTo(slideIndex)
          animateTimelineFunc?.next();
        });
      }
    }
  };

  const slideNext = () => {
    if (slideIndex < (user?.userStories?.length ?? 0) - 1) {
      slideIndex += 1;
      setSlideIndex(slideIndex);

      tinySliderRef.current?.slider.goTo(slideIndex);

      const timelineItems = storyTimelineRef.current?.querySelectorAll(
        ".timeline-item-inner-progress"
      );

      if (timelineItems && timelineItems.length > 0) {
        const _a_timelineItems = [...timelineItems];

        timeline.current.clear();
        gsap.set(_a_timelineItems.slice(0, slideIndex), {
          width: "100%",
        });
        timeline.current?.add(
          gsap.to(_a_timelineItems[slideIndex], {
            width: "100%",
            duration: storyTimeout / 1000,
            ease: "linear",
          })
        );
      }
    }
  };

  useEffect(() => {
    if (clicking) {
      timeline.current?.pause();
    } else {
      timeline.current?.play();
    }
  }, [clicking]);

  return user ? (
    <>
      {showStory ? (
        <div className="user-stories-wrapper flex items-center justify-center w-full h-full fixed top-0 left-0 z-50 bg-black/80">
          <div
            ref={userStoriesContainerRef}
            className="user-stories-container bg-black/80 rounded-md flex flex-col p-1 relative"
          >
            <div
              ref={storyTimelineRef}
              className="story-timeline-container w-full gap-1 flex justify-between"
            >
              {user.userStories.map((story, index) => {
                return (
                  <div
                    key={index}
                    className="timeline-item w-full h-full bg-white/30 rounded-md overflow-hidden"
                  >
                    <div
                      className="timeline-item-inner-progress bg-white w-0
                     h-full"
                    ></div>
                  </div>
                );
              })}
            </div>
            <div
              onClick={slidePrev}
              className="previous-trigger bg-red-700/50 w-3/12 h-full absolute left-0 top-0 z-30"
            ></div>
            <div
              onClick={slideNext}
              className="next-trigger bg-yellow-400/50 w-3/12 h-full absolute right-0 top-0 z-30"
            ></div>
            <div
              ref={pauseRef}
              onMouseDown={() => {
                if (!isUnmounted) {
                  setClicking(true);
                }
              }}
              onMouseUp={() => {
                if (!isUnmounted) {
                  setClicking(false);
                }
              }}
              onMouseLeave={() => {
                if (!isUnmounted) {
                  setClicking(false);
                }
              }}
              onBlur={() => {
                if (!isUnmounted) {
                  setClicking(false);
                }
              }}
              className="pause-trigger bg-emerald-200/50 w-6/12 z-30 absolute top-0 left-1/4 h-full"
            ></div>
            <div className="story-carousel w-full h-full">
              <TinySlider
                ref={tinySliderRef}
                settings={{
                  lazyload: true,
                  nav: false,
                  mouseDrag: false,
                  autoHeight: false,
                  controls: false,
                  autoplayButtonOutput: false,
                  autoplay: false,
                }}
              >
                {user.userStories.map((data, index) => (
                  <div
                    key={index}
                    className="relative pt-2 overflow-hidden rounded-md"
                  >
                    <img
                      className="tns-lazy-img w-full h-full object-cover select-none"
                      src={path.join(
                        `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                        "media/stories",
                        `${data.story.image}`
                      )}
                      data-src={path.join(
                        `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                        "media/stories",
                        `${data.story.image}`
                      )}
                    />
                  </div>
                ))}
              </TinySlider>
            </div>
          </div>
        </div>
      ) : null}
      <div className="m-5 flex flex-col gap-4">
        {user ? <Header /> : <></>}
        {hasPopup ? <Alert /> : null}
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
            onClick={handleProfileClick}
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
    </>
  ) : (
    <h1>Loading...</h1>
  );
}

export default ProfilePage;
