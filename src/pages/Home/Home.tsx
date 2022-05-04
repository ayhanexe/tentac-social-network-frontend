import axios from "axios";
import path from "path-browserify";
import React, { useEffect, useState } from "react";
import Header from "../../@components/Header/Header";
import HomeStoriesSlider from "../../@components/HomeStoriesSlider/HomeStoriesSlider";
import HomeUserInfo from "../../@components/HomeUserInfo/HomeUserInfo";
import PostComponent from "../../@components/ReplyComponent/PostComponent";
import PostService from "../../@tentac/services/postService/PostService";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import { getCurrentUser } from "../../utils/Utils";

export default function Home() {
  let unmounted = false;
  const [user, setUser] = useState<IAuthUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [wallPhoto, setWallPhoto] = useState<string>();
  const postService: PostService = new PostService();
  const [posts, setPosts] = useState<any[]>([]);

  const getFriends = async () => {
    if (user) {
      const posts = await postService.getAll({
        bearerToken: `${user.token}`,
      });

      // console.log(posts)
      for (const friendData of user.friends) {
        let filteredPosts = posts.filter((p) => p.user.id == friendData.friend);

        if (filteredPosts.length > 0 && !unmounted) {
          setPosts(filteredPosts);
        }

        // const friend = await axios.get(
        //   path.join(
        //     `${process.env.wREACT_APP_API_BASE}`,
        //     "Users",
        //     friendData.friend
        //   ),
        //   {
        //     headers: {
        //       Authorization: `Bearer ${user.token}`,
        //     },
        //   }
        // );
      }
    }
  };

  useEffect(() => {
    if (user) {
      getFriends();
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      const _user = await getCurrentUser();
      if (_user) {
        if (!unmounted) setUser(_user);
      }
    })();

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div className="m-5 flex flex-col gap-4">
      <Header />
      <div className="flex lg:flex-row flex-col items-start gap-10 lg:gap-0">
        <HomeUserInfo />
        <div className="w-full flex flex-col gap-10">
          <div className="w-full flex flex-col px-3">
            <HomeStoriesSlider />
          </div>
        </div>
      </div>
      <div className="w-full mt-10">
        <h1 className="text-3xl font-bold">Posts</h1>
        {posts.length == 0 ? <h1 className="text-3xl text-black/30 font-bold text-center my-10">No posts yet!</h1>:posts.map((post: any, index: number) => {
          return <PostComponent key={index} data={post} />;
        })}
      </div>
    </div>
  );
}
