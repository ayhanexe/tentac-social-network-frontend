import { profile } from "console";
import React, { ForwardedRef, useEffect } from "react";
import { HTMLProps } from "react";
import "./Profile.scss";

interface IProfile extends HTMLProps<HTMLDivElement> {
  radius?: string;
  imageUrl?: string | null;
  letters?: string | null;
  circleClass?: string | null;
  textClass?: string | null;
  hasStory?: boolean;
  storyBorderWidth?: string | null;
}

export const Profile = React.forwardRef<HTMLDivElement, IProfile>(
  (props, ref) => {
    const {
      storyBorderWidth,
      hasStory,
      textClass,
      circleClass,
      imageUrl,
      ...rest
    } = props;


    return (
      <div
        {...rest}
        ref={ref}
        className={`relative ${
          hasStory ? "cursor-pointer" : ""
        } profile-circle rounded-full overflow-hidden flex items-center justify-center ${
          circleClass ?? ""
        }`}
        style={{
          width: `${props.radius}`,
          height: `${props.radius}`,
          flex: `0 0 ${props.radius}`,
        }}
      >
        <div
          className={`${
            hasStory ? "active" : ""
          } story-color rounded-full w-full h-full absolute top-0 left-0 shadow-md flex items-center justify-center`}
        >
          <div
            className="story-center-color rounded-full flex items-center justify-center"
            style={{
              width: hasStory
                ? `calc(100% - ${storyBorderWidth ?? "10px"})`
                : "100%",
              height: hasStory
                ? `calc(100% - ${storyBorderWidth ?? "10px"})`
                : "100%",
              flex: hasStory
                ? `0 0 calc(100% - ${storyBorderWidth ?? "10px"})`
                : "0 0 100%",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                className="w-full h-full z-10 top-0 left-0 object-cover profile-image rounded-full"
                alt=""
              />
            ) : props.letters ? (
              <h5
                className={`uppercase antialiased text-lg font-medium ${
                  textClass ?? ""
                }`}
              >
                {props.letters}
              </h5>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default Profile;
