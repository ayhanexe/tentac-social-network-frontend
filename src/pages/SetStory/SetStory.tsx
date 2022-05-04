import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import path from "path-browserify";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import Header from "../../@components/Header/Header";
import { defaultPostLength } from "../../@tentac/constants/config.constants";
import { AlertService } from "../../@tentac/services";
import StoryService from "../../@tentac/services/story-service/story-service";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import {
  getCurrentUser,
  getFileFromInput,
  removeHtmlTagsFromString,
} from "../../utils/Utils";
import "./SetStory.scss";

const { CKEditor } = require("@ckeditor/ckeditor5-react");

const SetStory = () => {
  let unmounted = false;
  const [stories, setStories] = useState<any[]>([]);
  const [authUser, setAuthUser] = useState<IAuthUser | null>(null);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [textarea, setTextarea] = useState<string>("");
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const imageSelectorRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const alertService: AlertService = new AlertService();
  const storyService: StoryService = new StoryService();

  const handleImageSelect = () => {
    imageSelectorRef.current?.click();
  };

  useEffect(() => {
    (async () => {
      const _user = await getCurrentUser();
      const stories = await storyService.getAll({
        bearerToken: `${_user?.token}`,
      });

      if (!unmounted) {
        if (_user) {
          if (stories) {
            console.log(stories)
            console.log(_user)
            setStories(stories.filter((s: any) => s.user.id == _user.id));
          }
          setAuthUser(_user);
        }
      }
    })();
  }, []);

  useEffect(() => {
    imageSelectorRef.current?.addEventListener(
      "change",
      async function (e: Event) {
        if (!unmounted) {
          setIsImageLoading(true);
          const file = await getFileFromInput(this);

          if (imageRef.current) {
            imageRef.current.src = `${file}`;
            setImageSrc(file);
          }
          setIsImageLoading(false);
        }
      }
    );

    return () => {
      unmounted = true;
    };
  }, []);

  const handlePost = async (e: BaseSyntheticEvent) => {
    e.preventDefault();

    if (imageSrc) {
      if (textarea.length > 0) {
        if (authUser) {
          if (
            imageSelectorRef.current &&
            imageSelectorRef.current.files &&
            imageSelectorRef.current.files.length != 0
          ) {
            var formData = new FormData();
            formData.append("Image", imageSelectorRef.current.files[0]);
            formData.append("Text", textarea);
            formData.append("UserId", authUser.id);

            await axios
              .post(
                path.join(`${process.env.REACT_APP_API_BASE}`, "Stories"),
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${authUser.token}`,
                  },
                }
              )
              .then(async () => {
                setTextarea("");
                const _stories = await storyService.getAll({
                  bearerToken: `${authUser?.token}`,
                });
                setStories(_stories);
                await alertService.Success({
                  title: "Success",
                  text: "Story added successfully",
                });
              });
          }
        }
      } else {
        alertService.Error({
          title: "Ooops",
          text: "Please write something!",
        });
      }
    } else {
      alertService.Error({
        title: "Ooops",
        text: "Select the story image please!",
      });
    }
  };

  const handleStoryDelete = async (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        alertService
          .Warning(
            {
              title: "Delete",
              text: "Do you really want delete?",
              showCancelButton: true,
            },
            (res: any) =>
              new Promise((resolve, reject) => {
                try {
                  if (res.isConfirmed) {
                    storyService
                      .delete(id, {
                        bearerToken: `${authUser?.token}`,
                      })
                      .then(async () => {
                        setStories([...stories.filter((s) => s.id != id)]);
                        await alertService.Success({
                          title: "Success",
                          text: "Story deleted!",
                        });
                      })
                      .catch(() => {
                        alertService.Error({
                          title: "Ooops",
                          text: "Can't delete story. Please try refresh the page.",
                        });
                      });
                  } else {
                  }
                } catch (error) {
                  reject(error);
                }
              })
          )
          .then(() => {
            console.log("y");
          })
          .catch(() => {
            console.log("n");
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <div className="flex flex-col p-5">
      <Header />
      <h1 className="text-3xl font-bold my-4">Stories</h1>
      <div className="story-wrapper flex gap-3">
        <input ref={imageSelectorRef} type="file" className="hidden" />
        <div
          onClick={handleImageSelect}
          className="story-item flex items-center justify-center bg-white shadow-md rounded-md relative overflow-hidden opacity-50 hover:opacity-100 cursor-pointer transition-all duration-300 ease-out"
          style={{
            flex: "0 0 200px",
          }}
        >
          {isImageLoading ? (
            <div className="image-progress-filter flex items-center justify-center w-full h-full absolute z-30 bg-black/50">
              <i className="bi bi-arrow-clockwise text-white text-3xl animate-spin"></i>
            </div>
          ) : null}
          <img
            ref={imageRef}
            id="story-image"
            className="w-full h-full object-cover absolute top-0 left-0 z-10"
            src={path.join(
              `${process.env.REACT_APP_STATIC_FILES_BASE}`,
              "media/stories",
              "default-story.jpg"
            )}
          />
          <i className="bi bi-plus-circle-fill absolute z-20 text-3xl text-white"></i>
        </div>
        <form action="" className="h-full w-full">
          <div className="pl-5 py-3 bg-white form-div">
            <label className="text-xl font-bold">Post</label>
            <CKEditor
              editor={ClassicEditor}
              data="<p>Type something...</p>"
              onChange={(event: any, editor: any) => {
                if (!isInitial || isFocusing) {
                  const simpleText = removeHtmlTagsFromString(editor.getData());
                  if (simpleText.length <= defaultPostLength) {
                    setTextarea(editor.getData());
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
            <button
              onClick={async (e: BaseSyntheticEvent) => await handlePost(e)}
              className="bg-green-500 py-1 px-2 rounded-md text-white"
            >
              Post
            </button>
          </div>
        </form>
      </div>
      <hr className="mt-7" />
      <div className="user-stories w-100 flex flex-col mt-5">
        <h1 className="text-3xl font-bold mb-2">User Stories</h1>
        <div className="flex flex-col gap-3 flex-wrap items-start">
          {stories.length > 0 ? (
            stories.map((story: any, index: number) => {
              return (
                <div
                  key={index}
                  className="story-item-wrapper flex flex-col items-center "
                >
                  <div className="flex">
                    <div className="flex items-center ">
                      <h1 className="text-center text-xl font-bold uppercase mr-5">
                        {index + 1}
                      </h1>
                      <div
                        className="story-item flex items-center justify-center scale-100 hover:scale-105 z-30 bg-white shadow-md rounded-md relative overflow-hidden cursor-pointer transition-all duration-300 ease-out"
                        style={{
                          flex: "0 0 200px",
                        }}
                      >
                        <img
                          id="story-image"
                          className="w-full h-full object-cover absolute top-0 left-0 z-10"
                          src={path.join(
                            `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                            "media/stories",
                            `${story.story.image}`
                          )}
                        />
                      </div>
                    </div>
                    <div
                      className="flex flex-col pb-1 pt-7 px-5"
                      dangerouslySetInnerHTML={{
                        __html: story.text,
                      }}
                    ></div>
                    <div className="flex items-center px-10">
                      <button
                        onClick={() => handleStoryDelete(story.id)}
                        className="border-rose-700/50 text-white rounded-full opacity-0 translate-x-full transition-all duration-300 ease-out story-item-delete-button"
                      >
                        <i className="bi bi-trash3-fill text-rose-600 transition-all duration-300 ease-out"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="text-3xl font-bold opacity-50 my-5">
              There is no story yet!
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetStory;
