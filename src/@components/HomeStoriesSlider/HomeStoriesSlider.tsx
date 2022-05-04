import "./HomeStoriesSlider.scss";
import { memo, useEffect, useRef, useState } from "react";
import TinySliderReact from "tiny-slider-react";
import "tiny-slider/dist/tiny-slider.css";
import { generateColor, getCurrentUser, sleep } from "../../utils/Utils";
import { IAuthUser, IUserInfo } from "../../@tentac/types/auth/authTypes";
import path from "path-browserify";
import { IStory } from "../../@tentac/services/story-service/story-service.types";
import { Link } from "react-router-dom";
import PopupAlertService from "../../@tentac/services/popup-alert-service/PopupAlertService";
import gsap from "gsap";
import TinySlider from "tiny-slider-react";
import UserService from "../../@tentac/services/user-service/user-service";
import { isArray } from "lodash";

function HomeStoriesSlider() {
  let unmounted = false;
  const [user, setUser] = useState<IAuthUser>();
  const PopupService: PopupAlertService = new PopupAlertService();
  const [hasPopup, setHasPopup] = useState<boolean>(false);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [clicking, setClicking] = useState<boolean>(false);
  const timeline = useRef(gsap.timeline({ paused: clicking }));
  let [slideIndex, setSlideIndex] = useState<number>(0);
  const storyTimelineRef = useRef<HTMLDivElement>(null);
  const storyTimeout = 3000;
  const tinySliderRef = useRef<any>(null);
  let storyInterval: NodeJS.Timer | null = null;
  let [animateTimelineFunc, setAnimateTimelineFunc] =
    useState<AsyncGenerator | null>(null);
  const userStoriesContainerRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef<HTMLDivElement>(null);
  const [stories, setStories] = useState<any[]>([]);
  const userService: UserService = new UserService();

  const sliderSettings = {
    nav: false,
    mouseDrag: true,
    items: 5,
    gutter: 10,
  };

  const getStories = async (
    _user: IUserInfo,
    token: string
  ): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        let s = [...stories];
        for (const friend of _user.friends) {
          const fr = await userService.get(friend.friend, {
            bearerToken: `${token}`,
          });
          if (fr) {
            s.push(...fr?.userStories);
          }
        }
        resolve(s);
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const _user = await getCurrentUser();

      if (_user && !unmounted) {
        setUser(_user);
      }
    })();

    return () => {
      unmounted = true;
    };
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
    if (slideIndex < (stories?.length ?? 0) - 1) {
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

  async function handleStoriesSlider() {
    if (storyInterval) clearInterval(storyInterval);
  }

  useEffect(() => {
    if (timeline.current) {
      timeline.current.then(async () => {
        if (!unmounted) setSlideIndex(slideIndex + 1);
        slideIndex += 1;
        if (animateTimelineFunc) await animateTimelineFunc.next();
      });
    }
  }, [timeline, animateTimelineFunc]);

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
          slideNext();
        });
      }
    }
  }

  const handleSeeStories = async () => {
    if (!unmounted) {
      await sleep(0);
      await PopupService.Hide();
      setHasPopup(false);
      setShowStory(true);
      timeline.current.clear();
      slideIndex = 0;
      setSlideIndex(0);

      if (storyTimelineRef.current) {
        if (!unmounted) {
          (async () => {
            await animateTimeline();
          })();

          handleStoriesSlider();
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
    document.addEventListener("click", async (e) => {
      if (
        !unmounted &&
        userStoriesContainerRef.current &&
        !e.composedPath().includes(userStoriesContainerRef.current)
      ) {
        setHasPopup(false);
        setShowStory(false);
        if (storyInterval) clearInterval(storyInterval);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        await getStories(user, user.token).then((data) => {
          if (isArray(data) && !unmounted) {
            setStories([...stories, ...data, ...user.userStories]);
          }
        });
      })();
    }
  }, [user]);

  return (
    <>
      {showStory && user ? (
        <div className="user-stories-wrapper flex items-center justify-center w-full h-full fixed top-0 left-0 z-50 bg-black/80">
          <div
            ref={userStoriesContainerRef}
            className="user-stories-container bg-black/80 rounded-md flex flex-col p-1 relative"
          >
            <div
              ref={storyTimelineRef}
              className="story-timeline-container w-full gap-1 flex justify-between"
            >
              {stories.map((story, index) => {
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
                if (!unmounted) {
                  setClicking(true);
                }
              }}
              onMouseUp={() => {
                if (!unmounted) {
                  setClicking(false);
                }
              }}
              onMouseLeave={() => {
                if (!unmounted) {
                  setClicking(false);
                }
              }}
              onBlur={() => {
                if (!unmounted) {
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
                {stories.map((data, index) => (
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
      <div className="slider-container">
        <h1 className="text-3xl mb-1 font-bold">Stories</h1>
        {user && stories.length == 0 ? (
          <TinySliderReact
            settings={{
              ...sliderSettings,
              fixedWidth: 200,
            }}
          >
            <Link to={`add-story/${user.id}`}>
              <div className="slider-item-wrapper" title="add story">
                <div className="slider-item relative cursor-pointer opacity-50 hover:opacity-100 transition-opacity ease-in-out duration-300 h-full rounded-md overflow-hidden">
                  <i className="bi bi-plus absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white/50 text-5xl"></i>
                  <img
                    src="/assets/media/tentac-authentication-page.jpg"
                    alt=""
                  />
                </div>
              </div>
            </Link>
          </TinySliderReact>
        ) : user ? (
          <TinySliderReact
            settings={{
              ...sliderSettings,
              fixedWidth: 200,
            }}
          >
            <Link to={`add-story/${user.id}`}>
              <div className="slider-item-wrapper" title="add story">
                <div className="slider-item relative cursor-pointer opacity-50 hover:opacity-100 transition-opacity ease-in-out duration-300 h-full rounded-md overflow-hidden">
                  <i className="bi bi-plus absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white/50 text-5xl"></i>
                  <img
                    src="/assets/media/tentac-authentication-page.jpg"
                    alt=""
                  />
                </div>
              </div>
            </Link>
            {stories.map((story: IStory, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => handleSeeStories()}
                  className="slider-item-wrapper"
                >
                  <div className="slider-item cursor-pointer transition-opacity ease-in-out duration-300 h-full rounded-md overflow-hidden">
                    <img
                      src={path.join(
                        `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                        "media/stories",
                        story.story.image
                      )}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </TinySliderReact>
        ) : null}
      </div>
    </>
  );
}

// {user.userStories.map((story:any, index:number) => (
//   <div className="slider-item-wrapper" key={index}>
//     <div
//       className={`slider-item cursor-pointer opacity-50 hover:opacity-100 transition-opacity ease-in-out duration-300 h-full rounded-md overflow-hidden`}
//       style={{
//         // backgroundColor: data.randomColor,
//       }}
//     >
//       {/* <img
//         src={data.imageUrl}
//         className="w-full h-full object-cover"
//       /> */}
//     </div>
//   </div>
// ))}

export default memo(HomeStoriesSlider);
