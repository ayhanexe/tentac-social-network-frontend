import { debug } from "console";
import { isNumber } from "lodash";
import path from "path-browserify";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { defaultPostLength } from "../../@tentac/constants/config.constants";
import { AlertService } from "../../@tentac/services";
import PostService from "../../@tentac/services/postService/PostService";
import {
  IAuthUser,
  IBackendUser,
  IUserInfo,
} from "../../@tentac/types/auth/authTypes";
import { IPost } from "../../@tentac/types/auth/userTypes";
import { getCurrentUser, removeHtmlTagsFromString } from "../../utils/Utils";
import Profile from "../Profile/Profile";
import "./PostComponent.scss";

const { CKEditor } = require("@ckeditor/ckeditor5-react");
const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

export interface IReplyProps {
  text: string;
  profile: IUserInfo | IAuthUser;
  replys: IReplyProps[];
}

export interface IPostData {
  text: string;
  profile: IUserInfo;
  replys: IReplyProps[];
}

export interface IPostProps {
  onDelete?: ({ ...args }) => any;
  data: IPost;
}

interface IReplyData {
  target: string;
}

export default function PostComponent(props: IPostProps) {
  let isUnmounted = false;
  const [postData, setPostData] = useState<IPost>();
  const [authUser, setAuthUser] = useState<IAuthUser>();
  const postService: PostService = new PostService();
  const [replyData, setReplyData] = useState<IReplyData | null>();

  const [textarea, setTextarea] = useState<string>("");
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [isFocusing, setIsFocusing] = useState<boolean>(false);

  const handleLike = async (e: BaseSyntheticEvent, data: any) => {
    const likeTextElement = e.target.parentNode.querySelector(".post-likes");
    const likeText = likeTextElement.textContent;

    if ((isNumber(postData), authUser)) {
      postService.likePost(Number(data.id), authUser.id, {
        bearerToken: `${authUser.token}`,
        token: `${authUser.token}`,
        success: (data) => {
          if (!isUnmounted) {
            if (isNumber(parseInt(likeText))) {
              likeTextElement.textContent = parseInt(likeText) + 1;
            }
          }
        },
      });
    }
  };

  const handleDislike = async (e: BaseSyntheticEvent, data: any) => {
    const likeTextElement = e.target.parentNode.querySelector(".post-likes");
    const likeText = likeTextElement.textContent;

    if ((isNumber(postData), authUser)) {
      postService.dislikePost(Number(postData?.id), authUser.id, {
        bearerToken: `${authUser.token}`,
        token: `${authUser.token}`,
        success: (data) => {
          if (!isUnmounted) {
            if (isNumber(parseInt(likeText))) {
              likeTextElement.textContent = parseInt(likeText) - 1;
            }
          }
        },
      });
    }
  };

  const handleReplyLike = async (e: BaseSyntheticEvent, data: any) => {
    const likeTextElement = e.target.parentNode.querySelector(".post-likes");
    const likeText = likeTextElement.textContent;

    if (postData && postData.id && isNumber(postData.id) && authUser) {
      postService.likeReply(Number(postData.id), data.id, authUser.id, {
        bearerToken: `${authUser.token}`,
        token: `${authUser.token}`,
        success: (data) => {
          if (!isUnmounted) {
            if (isNumber(parseInt(likeText))) {
              likeTextElement.textContent = parseInt(likeText) + 1;
            }
          }
        },
      });
    }
  };

  const handleReplyDislike = async (e: BaseSyntheticEvent, data: any) => {
    const likeTextElement = e.target.parentNode.querySelector(".post-likes");
    const likeText = likeTextElement.textContent;

    if (postData && postData.id && isNumber(postData.id) && authUser) {
      postService.dislikeReply(Number(postData.id), data.id, authUser.id, {
        bearerToken: `${authUser.token}`,
        token: `${authUser.token}`,
        success: (data) => {
          if (!isUnmounted) {
            if (isNumber(parseInt(likeText))) {
              likeTextElement.textContent = parseInt(likeText) - 1;
            }
          }
        },
      });
    }
  };

  const handleReply = async (e: BaseSyntheticEvent) => {
    const target = e.target.closest(".post-item").dataset.id;

    setReplyData({
      target,
    });
  };

  const handleCommentPost = async () => {
    if (authUser && replyData) {
      const postId = parseInt(replyData.target);
      const userId = authUser?.id;
      const text = textarea;

      await postService.replyPost(postId, userId, text, {
        bearerToken: `${authUser.token}`,
        success: async () => {
          if (!isUnmounted) setReplyData(null);
          if (!isUnmounted && postData && postData.id != undefined) {
            const postItem = await postService.get(postData.id, {
              bearerToken: `${authUser.token}`,
            });
            setPostData(postItem);
          }
        },
      });
    }
  };

  useEffect(() => {
    if (!isUnmounted) setPostData(props.data);

    (async () => {
      const _user = await getCurrentUser();

      if (_user && !isUnmounted) {
        setAuthUser(_user);
      }
    })();

    return () => {
      isUnmounted = true;
    };
  }, []);

  const handleDelete = () => {
    if (authUser && postData?.user.id == authUser?.id) {
      const alertService: AlertService = new AlertService();

      alertService.Warning(
        {
          text: "Warning deleting post! Are you sure?",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        },
        (data: any) =>
          new Promise(async (resolve, reject) => {
            if (data?.isConfirmed) {
              if (postData?.id) {
                const response = await postService.delete(postData?.id, {
                  bearerToken: `${authUser.token}`,
                  token: `${authUser.token}`,
                });
                if (props.onDelete)
                  props.onDelete({
                    id: postData?.id,
                  });
              } else {
                alertService.Error({
                  text: "Invalid Props!",
                });
              }
            }
          })
      );
    }
  };

  const handleReplyDelete = async (postId: number, id: number) => {
    if (authUser) {
      const alertService: AlertService = new AlertService();
      const post = await postService.get(postId, {
        bearerToken: `${authUser.token}`,
      });
      const reply = post.postReplies?.filter((p) => {
        if (p.user.id == authUser.id) return p;
      });

      if (post && reply?.length > 0) {
        alertService.Warning(
          {
            text: "Warning deleting post! Are you sure?",
            showCancelButton: true,
            cancelButtonText: "Cancel",
          },
          (data: any) =>
            new Promise(async (resolve, reject) => {
              if (data?.isConfirmed) {
                if (post && post.id) {
                  const response = await postService.deleteReply(
                    reply[0].id,
                    post.id,
                    {
                      bearerToken: `${authUser.token}`,
                      token: `${authUser.token}`,
                      success: async () => {
                        const post = await postService.get(postId, {
                          bearerToken: `${authUser.token}`,
                        });

                        if (post && !isUnmounted) {
                          setPostData(post);
                        }
                      },
                    }
                  );
                } else {
                  alertService.Error({
                    text: "Invalid Props!",
                  });
                }
              }
            })
        );
      }
    }
  };

  const handleDeleteReply = () => {
    if (!isUnmounted) setReplyData(null);
  };

  return (
    <div
      data-id={postData?.id}
      className="parent-post-item post-item w-full my-5 flex flex-col"
    >
      <div className="flex">
        <div className="profile-area">
          <Profile
            radius="60px"
            imageUrl={
              postData?.user.profilePhotoUrl
                ? postData?.user.profilePhotoUrl
                : postData?.user.profilePhotoName ||
                  postData?.user.profilePhotoName
                ? path.join(
                    `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                    "media/profiles",
                    `${postData?.user.profilePhoto}` ??
                      `${postData?.user.profilePhotoName}`
                  )
                : null
            }
            letters={postData?.user?.letters}
            storyBorderWidth="6px"
            defaultIconClass="text-2xl"
          />
        </div>
        <div className="flex flex-col ml-4 w-full">
          <span className="text-sm font-medium mb-1 cursor-pointer">
            @{postData?.user?.userName}
          </span>
          <div
            id="message-area"
            className="bg-white w-full rounded-lg shadow-sm p-3 z-20"
          >
            <div dangerouslySetInnerHTML={{ __html: `${postData?.text}` }} />
          </div>
          <div className="actions w-full flex justify-end">
            {authUser && postData?.user.id == authUser.id ? (
              <div className="flex gap-3">
                <button
                  onClick={handleReply}
                  className="post-delete-button bg-none text-black text-sm font-medium mt-1 cursor-pointer"
                >
                  Reply
                </button>
                <button
                  onClick={handleDelete}
                  className="post-delete-button bg-none text-black text-sm font-medium mt-1 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="z-10 parent-actions-container flex flex-col justify-center px-2 -mt-2">
          <i
            onClick={(e) => handleLike(e, postData)}
            className="bi bi-hand-thumbs-up-fill cursor-pointer text-xs"
          ></i>
          <span className="post-likes text-xs font-medium">

            {postData?.postLikes?.length ?? 0}
          </span>
          <i
            onClick={(e) => handleDislike(e, postData)}
            className="bi bi-hand-thumbs-down-fill cursor-pointer text-xs"
          ></i>
        </div>
      </div>

      <div className="reply-container">
        {replyData && `${postData?.id}` == replyData.target ? (
          <div className="post-item w-full mr-6 flex flex-col">
            <div className="flex">
              <div className="profile-area">
                <Profile
                  radius="60px"
                  imageUrl={
                    postData?.user.profilePhotoUrl
                      ? postData?.user.profilePhotoUrl
                      : postData?.user.profilePhoto ||
                        postData?.user.profilePhotoName
                      ? path.join(
                          `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                          "media/profiles",
                          postData?.user.profilePhoto ??
                            postData?.user.profilePhotoName ??
                            ""
                        )
                      : null
                  }
                  letters={postData?.user?.letters}
                  storyBorderWidth="6px"
                  defaultIconClass="text-2xl"
                />
              </div>
              <div className="flex flex-col ml-4 w-full">
                <span className="text-sm font-medium mb-1 cursor-pointer">
                  @{postData?.user?.userName}
                </span>
                <div
                  id="message-area"
                  className="bg-white w-full rounded-lg shadow-sm px-3 z-20"
                >
                  <CKEditor
                    editor={ClassicEditor}
                    data="<p>Type something...</p>"
                    onChange={(event: any, editor: any) => {
                      if (!isInitial || isFocusing) {
                        const simpleText = removeHtmlTagsFromString(
                          editor.getData()
                        );
                        if (simpleText?.length <= defaultPostLength) {
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
                </div>
                <div className="actions w-full flex justify-end">
                  {authUser && postData?.user.id == authUser.id ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteReply}
                        className="post-delete-button bg-none text-black text-sm font-medium mt-1 cursor-pointer"
                      >
                        Delete
                      </button>
                      <button
                        onClick={async () => await handleCommentPost()}
                        className="bg-blue-700 px-3 py-1 rounded-md text-xs text-white font-medium mt-1 cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {postData && postData.postReplies?.length > 0
          ? postData?.postReplies.map((data: any, index: number) => {
              return (
                <div
                  data-id={data.id}
                  data-username={data?.user?.userName}
                  className="post-item w-full my-5 flex flex-col"
                  key={index}
                >
                  <div className="flex">
                    <div className="profile-area">
                      <Profile
                        radius="60px"
                        imageUrl={
                          postData?.user?.profilePhotoUrl
                            ? postData?.user?.profilePhotoUrl
                            : data?.user?.profilePhoto
                            ? path.join(
                                `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                                "media/profiles",
                                data.user.profilePhoto
                              )
                            : null
                        }
                        letters={postData?.user?.letters}
                        storyBorderWidth="6px"
                        defaultIconClass="text-2xl"
                      />
                    </div>
                    <div className="flex flex-col ml-4 w-full">
                      <span className="text-sm font-medium mb-1 cursor-pointer">
                        @{data.user?.userName}
                      </span>
                      <div
                        id="message-area"
                        className="bg-white w-full rounded-lg shadow-sm p-3 z-20"
                      >
                        <div
                          className="reply-item-text"
                          dangerouslySetInnerHTML={{
                            __html: `${
                              data.parent
                                ? `<span class="font-medium italic cursor-pointer">@${data.parent.userName} </span>`
                                : ""
                            }<span>${data.text}</span>`,
                          }}
                        />
                      </div>
                      <div className="actions w-full flex justify-end">
                        {authUser && postData?.user.id == authUser.id ? (
                          <button
                            onClick={() => {
                              if (postData && postData.id) {
                                handleReplyDelete(postData.id, data.id);
                              }
                            }}
                            className="post-delete-button bg-none text-black text-sm font-medium mt-1 cursor-pointer"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div className="z-10 actions-container flex flex-col justify-center px-2 -mt-2">
                      <i
                        onClick={(e) => handleReplyLike(e, data)}
                        className="bi bi-hand-thumbs-up-fill cursor-pointer text-xs"
                      ></i>
                      <span className="post-likes text-xs font-medium">
                        {data.postLikes?.length ?? 0}
                      </span>
                      <i
                        onClick={(e) => handleReplyDislike(e, data)}
                        className="bi bi-hand-thumbs-down-fill cursor-pointer text-xs"
                      ></i>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
