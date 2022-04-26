import { merge } from "lodash";
import path from "path-browserify";
import { memo, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TinySlider from "tiny-slider-react";
import Header from "../../@components/Header/Header";
import Profile from "../../@components/Profile/Profile";
import PostComponent from "../../@components/ReplyComponent/PostComponent";
import PopupAlertService from "../../@tentac/services/popup-alert-service/PopupAlertService";
import PostService from "../../@tentac/services/postService/PostService";
import UserService from "../../@tentac/services/user-service/user-service";
import { IAuthUser, IBackendUser } from "../../@tentac/types/auth/authTypes";
import { IPost } from "../../@tentac/types/auth/userTypes";
import gsap from "gsap";
import { getCurrentUser, makeAssetUrl, sleep } from "../../utils/Utils";

import "./PersonDetails.scss";

function PersonDetails() {
  let isUnmounted: boolean = false;
  const { id } = useParams();
  const [user, setUser] = useState<IAuthUser>();
  const [profileUser, setProfileUser] = useState<IBackendUser>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const userService: UserService = new UserService();
  const postService: PostService = new PostService();
  const [hasPopup, setHasPopup] = useState<boolean>(false);
  const PopupService: PopupAlertService = new PopupAlertService();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [showStory, setShowStory] = useState<boolean>(false);
  const [letters, setLetters] = useState<string>();
  const storyTimelineRef = useRef<HTMLDivElement>(null);
  const storyTimeout = 3000;
  let [slideIndex, setSlideIndex] = useState<number>(0);
  const tinySliderRef = useRef<any>(null);
  const [clicking, setClicking] = useState<boolean>(false);
  const timeline = useRef(gsap.timeline({ paused: clicking }));
  let storyInterval: NodeJS.Timer | null = null;
  const pauseRef = useRef<HTMLDivElement>(null);
  const userStoriesContainerRef = useRef<HTMLDivElement>(null);

  async function animateTimeline() {
    if (storyTimelineRef.current) {
      const timelineItems = storyTimelineRef.current.querySelectorAll(
        ".timeline-item-inner-progress"
      );
      timeline.current?.add(
        gsap.to(timelineItems[slideIndex], {
          width: "100%",
          duration: storyTimeout / 1000,
          ease: "linear",
        })
      );
      if (timeline.current.then) {
        timeline.current?.then(() => {
          if (slideIndex + 1 == timelineItems.length) {
            setHasPopup(false);
            setShowStory(false);
            timeline.current.clear();
            timeline.current.restart();
            if (storyInterval) clearInterval(storyInterval);
          }
          timeline.current.restart();
          slideNext();
        });
      }
    }
  }

  const handleSeeStories = async () => {
    if (!isUnmounted) {
      await sleep(0);
      await PopupService.Hide();
      setHasPopup(false);
      setShowStory(true);
      timeline.current.clear();
      timeline.current.restart();
      slideIndex = 0;
      setSlideIndex(0);

      if (storyTimelineRef.current) {
        if (!isUnmounted) {
          (async () => {
            await animateTimeline();
          })();

          handleStoriesSlider();
        }
      }
    }
  };
  async function handleStoriesSlider() {
    if (storyInterval) clearInterval(storyInterval);
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
        {profileUser?.profilePhoto ? (
          <a
            target="_blank"
            href={path.join(
              `${process.env.REACT_APP_STATIC_FILES_BASE}`,
              "media/profiles",
              profileUser?.profilePhoto
            )}
            className="py-1 px-2 text-center text-white rounded-md bg-black/50 my-2 w-2/4"
          >
            See Profile Image
          </a>
        ) : null}
        {profileUser && profileUser.userStories.length > 0 ? (
          <button
            onClick={handleSeeStories}
            className="py-1 px-2 text-center text-white rounded-md bg-black/50 my-2 w-2/4"
          >
            See Stories
          </button>
        ) : null}
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
    });
  }, []);
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
        timeline.current.pause();
        gsap.set(
          _a_timelineItems.slice(-(_a_timelineItems.length - slideIndex)),
          {
            width: "0%",
          }
        );
        timeline.current?.add(
          gsap.to(_a_timelineItems[slideIndex], {
            width: "100%",
            duration: storyTimeout / 1000,
            ease: "linear",
          })
        );
        timeline.current.clear();
        timeline.current.play();
        animateTimeline();
      }
    }
  };

  const slideNext = () => {
    if (slideIndex < (profileUser?.userStories?.length ?? 0) - 1) {
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

        if (timeline.current.then) {
          timeline.current.then(() => {
            if (slideIndex + 1 == timelineItems.length) {
              setHasPopup(false);
              setShowStory(false);
              timeline.current.clear();
              timeline.current.restart();
              if (storyInterval) clearInterval(storyInterval);
            }
          });
        }
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

  useEffect(() => {
    (async () => {
      const authUser = await getCurrentUser();

      if (authUser && !isUnmounted && id) {
        setUser(authUser);

        const posts = await postService.getAll({
          bearerToken: `${authUser.token}`,
        });
        setPosts(posts.filter((post) => post.user.id == id));

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

  const handleProfileClick = () => {
    if (!isUnmounted) {
      PopupService.Show();
      setHasPopup(true);
    }
  };

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
  }, [user]);

  return (
    <div className="p-5">
      {hasPopup ? <Alert /> : null}

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
              {profileUser?.userStories.map((story, index) => {
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
              className="previous-trigger w-3/12 h-full absolute left-0 top-0 z-30"
            ></div>
            <div
              onClick={slideNext}
              className="next-trigger w-3/12 h-full absolute right-0 top-0 z-30"
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
              className="pause-trigger w-6/12 z-30 absolute top-0 left-1/4 h-full"
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
                {profileUser?.userStories.map((data, index) => (
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
                profileUser.profilePhoto
                  ? path.join(
                      `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                      "media/profiles",
                      `${profileUser.profilePhoto}`
                    )
                  : null
              }
              letters={letters}
              circleClass="-translate-y-1/4 ml-10 shadow-lg z-10 cursor-pointer"
              textClass="text-6xl"
              defaultIconClass="text-6xl"
              hasStory={profileUser && profileUser.userStories.length > 0}
              onClick={handleProfileClick}
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
            {posts.length > 0 ? (
              posts.map((data: any, index: number) => {
                return (
                  <PostComponent
                    key={index}
                    data={{ ...data, user: profileUser }}
                  />
                );
              })
            ) : (
              <h1 className="text-center text-4xl font-medium text-stone-900/30">
                There is no post yet!
              </h1>
            )}
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default PersonDetails;
