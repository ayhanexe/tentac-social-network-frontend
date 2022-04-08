import { debug } from "console";
import { isNumber } from "lodash";
import path from "path-browserify";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { AlertService } from "../../@tentac/services";
import PostService from "../../@tentac/services/postService/PostService";
import {
  IAuthUser,
  IBackendUser,
  IUserInfo,
} from "../../@tentac/types/auth/authTypes";
import { IPost } from "../../@tentac/types/auth/userTypes";
import { getCurrentUser } from "../../utils/Utils";
import Profile from "../Profile/Profile";
import "./PostComponent.scss";

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

export default function PostComponent(props: IPostProps) {
  let isUnmounted = false;
  const [authUser, setAuthUser] = useState<IAuthUser>();
  const postService: PostService = new PostService();

  const handleLike = async (e:BaseSyntheticEvent, data: any) => {
    const likeTextElement = e.target.parentNode.querySelector(".post-likes");
    const likeText = likeTextElement.textContent;
    console.log(isNumber(parseInt(likeText)))
    console.log("SADAS")

    if ((isNumber(props.data), authUser)) {
      postService.likePost(Number(data.id), authUser.id, {
        bearerToken: `${authUser.token}`,
        token: `${authUser.token}`,
        success: (data) => {
          if (!isUnmounted) {
            if(isNumber(parseInt(likeText))) {
            }
          };
        },
      });
    }
  };

  const handleDislike = async (e:BaseSyntheticEvent, data: any) => {
    if ((isNumber(props.data), authUser)) {
      postService.dislikePost(Number(props.data.id), authUser.id, {
        bearerToken: `${authUser.token}`,
        token: `${authUser.token}`,
        success: (data) => {
          // if (!isUnmounted) setPostLikes(postLikes - 1);
        },
      });
    }
  };

  useEffect(() => {
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
    if (authUser && props.data.user.id == authUser?.id) {
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
              if (props.data.id) {
                const response = await postService.delete(props.data.id, {
                  bearerToken: `${authUser.token}`,
                  token: `${authUser.token}`,
                });
                if (props.onDelete)
                  props.onDelete({
                    id: props.data.id,
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

  return (
    <div className="parent-post-item post-item w-full my-5 flex flex-col">
      <div className="flex">
        <div className="profile-area">
          <Profile
            radius="60px"
            imageUrl={
              props.data.user.profilePhotoUrl
                ? props.data.user.profilePhotoUrl
                : path.join(
                    `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                    "media/profiles",
                    props.data.user.profilePhoto ??
                      props.data.user.profilePhotoName
                  )
            }
            letters={props.data.user?.letters}
            storyBorderWidth="6px"
            defaultIconClass="text-2xl"
          />
        </div>
        <div className="flex flex-col ml-4 w-full">
          <span className="text-sm font-medium mb-1 cursor-pointer">
            @{props.data.user?.userName}
          </span>
          <div
            id="message-area"
            className="bg-white w-full rounded-lg shadow-sm p-3 z-20"
          >
            <div dangerouslySetInnerHTML={{ __html: props.data.text }} />
          </div>
          <div className="actions w-full flex justify-end">
            {authUser && props.data.user.id == authUser.id ? (
              <button
                onClick={handleDelete}
                className="post-delete-button bg-none text-black text-sm font-medium mt-1 cursor-pointer"
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>
        <div className="z-10 parent-actions-container flex flex-col justify-center px-2 -mt-2">
          <i
            onClick={(e) => handleLike(e, props.data)}
            className="bi bi-hand-thumbs-up-fill cursor-pointer text-xs"
          ></i>
          <span className="post-likes text-xs font-medium">{props.data.postLikes.length ?? 0}</span>
          <i
            onClick={(e) => handleDislike(e, props.data)}
            className="bi bi-hand-thumbs-down-fill cursor-pointer text-xs"
          ></i>
        </div>
      </div>
      {props.data.postReplies.length > 0 ? (
        <div className="reply-container">
          {props.data.postReplies.map((data, index) => {
            console.log(data);
            return (
              <div className="post-item w-full my-5 flex flex-col" key={index}>
                <div className="flex">
                  <div className="profile-area">
                    <Profile
                      radius="60px"
                      imageUrl={
                        props.data.user.profilePhotoUrl
                          ? props.data.user.profilePhotoUrl
                          : path.join(
                              `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                              "media/profiles",
                              data.user.profilePhoto ??
                                data.user.profilePhotoName ??
                                ""
                            )
                      }
                      letters={props.data.user?.letters}
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
                      {authUser && props.data.user.id == authUser.id ? (
                        <button
                          onClick={handleDelete}
                          className="post-delete-button bg-none text-black text-sm font-medium mt-1 cursor-pointer"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="z-10 actions-container flex flex-col justify-center px-2 -mt-2">
                    <i
                      onClick={(e) => handleLike(e, data)}
                      className="bi bi-hand-thumbs-up-fill cursor-pointer text-xs"
                    ></i>
                    <span className="post-likes text-xs font-medium">{data.postLikes.length}</span>
                    <i
                      onClick={(e) => handleDislike(e, data)}
                      className="bi bi-hand-thumbs-down-fill cursor-pointer text-xs"
                    ></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
