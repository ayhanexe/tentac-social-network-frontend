import path from "path-browserify";
import { useEffect, useState } from "react";
import { AlertService } from "../../@tentac/services";
import PostService from "../../@tentac/services/postService/PostService";
import { IAuthUser, IUserInfo } from "../../@tentac/types/auth/authTypes";
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
  const [user, setUser] = useState<IAuthUser>();

  const handleDelete = () => {
    if (user) {
      const alertService: AlertService = new AlertService();
      const postService: PostService = new PostService();

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
                  bearerToken: `${user.token}`,
                  token: `${user.token}`,
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

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) setUser(user);
    })();
  }, []);

  return (
    <div className="post-item w-full my-5 flex flex-col">
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
            className="bg-white w-full rounded-lg shadow-sm p-3"
          >
            {props.data.text}
          </div>
          <div className="actions w-full flex justify-end">
            <button
              onClick={handleDelete}
              className="post-delete-button bg-red-600/50 text-white px-2 rounded-md mt-3 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="actions-container flex flex-col justify-center px-2 pt-4">
          <i className="bi bi-hand-thumbs-up-fill cursor-pointer text-sm"></i>
          <span className="text-sm font-medium">50</span>
          <i className="bi bi-hand-thumbs-down-fill cursor-pointer text-sm"></i>
        </div>
      </div>
      <div className="reply-container">
        {/* <div className="post-item w-3/4 my-5 ml-auto flex flex-col">
          <div className="flex">
            <div className="profile-area">
              <Profile
                radius="60px"
                imageUrl={profilePhoto ?? null}
                letters={letters}
                storyBorderWidth="6px"
                defaultIconClass="text-2xl"
              />
            </div>
            <div className="flex flex-col ml-4 w-full">
              <span className="text-sm font-medium mb-1 cursor-pointer">
                @Ayhanexe
              </span>
              <div
                id="message-area"
                className="bg-white w-full rounded-lg shadow-sm p-3"
              >
                <span className="text-sm font-medium mb-1 mr-1 italic cursor-pointer">
                  @Ayhanexe
                </span>
                Salam
              </div>
            </div>
            <div className="actions-container flex flex-col justify-center px-2 pt-4">
              <i className="bi bi-hand-thumbs-up-fill cursor-pointer text-sm"></i>
              <span className="text-sm font-medium">10</span>
              <i className="bi bi-hand-thumbs-down-fill cursor-pointer text-sm"></i>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
