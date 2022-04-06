import { merge } from "lodash";
import path from "path-browserify";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../@components/Header/Header";
import Profile from "../../@components/Profile/Profile";
import PostComponent from "../../@components/ReplyComponent/PostComponent";
import useSignalR from "../../@tentac/contexts/SignalRContext/SignalRContext";
import UserService from "../../@tentac/services/user-service/user-service";
import { IAuthUser, IBackendUser } from "../../@tentac/types/auth/authTypes";
import { getCurrentUser, makeAssetUrl } from "../../utils/Utils";

import "./PersonDetails.scss";

function PersonDetails() {
  let isUnmounted: boolean = false;
  const { id } = useParams();
  const [user, setUser] = useState<IAuthUser>();
  const [profileUser, setProfileUser] = useState<IBackendUser>();
  const userService: UserService = new UserService();
  const { invokeServerside } = useSignalR({
    onUserPost: async (data: any) => {
      if (profileUser && id == profileUser.id && user) {
        const _user = await userService.get(id, {
          bearerToken: user.token,
          token: user.token,
        });

        if (_user) {
          setProfileUser(_user);
        }
      }
    },
  });

  useEffect(() => {
    (async () => {
      const authUser = await getCurrentUser();

      if (authUser && !isUnmounted && id) {
        setUser(authUser);

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

  return (
    <div className="p-5">
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
                makeAssetUrl(`${profileUser.profilePhoto}`, "media/profiles") ??
                null
              }
              letters={profileUser.letters}
              circleClass="-translate-y-1/4 ml-10 shadow-lg z-10"
              textClass="text-6xl"
              defaultIconClass="text-6xl"
              hasStory={true}
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
            {profileUser.userPosts.map((data: any, index: number) => {
              return (
                <PostComponent
                  key={index}
                  data={merge(data.post, {
                    user: profileUser,
                  })}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h1>sdasdas</h1>
      )}
    </div>
  );
  // return profileUser && user ? (
  //   <div className="m-5 flex flex-col gap-4">
  //     {user ? <Header /> : <></>}
  //     <main>
  //       <div id="wall" className="w-full rounded-lg overflow-hidden">
  //         <img
  //           src={path.join(
  //             `${process.env.REACT_APP_STATIC_FILES_BASE}`,
  //             `media/walls`,
  //             `${profileUser.userWall}`
  //           )}
  //           className="w-full h-full object-cover"
  //           alt=""
  //         />
  //       </div>
  //       <Profile
  //         radius="250px"
  //         imageUrl={profileUser.profilePhoto ?? null}
  //         letters={profileUser.letters}
  //         circleClass="-translate-y-1/4 ml-10 shadow-lg z-10"
  //         textClass="text-6xl"
  //         defaultIconClass="text-6xl"
  //         hasStory={true}
  //       />
  //       <div id="content-area" className="w-full">
  //         <h1 className="ml-80 text-4xl font-black mb-32">
  //           {user?.name && user?.surname ? (
  //             `${user.name} ${user.surname}`
  //           ) : user?.userName ? (
  //             user.userName
  //           ) : (
  //             <></>
  //           )}
  //         </h1>

  //         <div className="w-full flex gap-3 items-start">
  //           {/* Post Area */}
  //           <div className="flex w-full flex-col">
  //             <div
  //               id="post-area"
  //               className="w-full bg-white/90 pt-3 pb-5 px-4 rounded-xl flex flex-col gap-4"
  //             >
  //               <h1 className="text-xl font-semibold">Post Something</h1>
  //               <div className="flex">
  //                 {/* <Profile
  //                 radius="60px"
  //                 imageUrl={profilePhoto ?? null}
  //                 letters={letters}
  //                 hasStory={true}
  //                 storyBorderWidth="6px"
  //                 defaultIconClass="text-2xl"
  //               /> */}
  //                 {/* <div className="flex flex-col w-full items-end pl-3">
  //                 <CKEditor
  //                   editor={ClassicEditor}
  //                   data="<p>Type something...</p>"
  //                   onKeyDown={() => console.log("asdwq")}
  //                   onChange={(event: any, editor: any) => {
  //                     if (!isInitial || isFocusing) {
  //                       const simpleText = removeHtmlTagsFromString(
  //                         editor.getData()
  //                       );
  //                       if (simpleText.length <= defaultPostLength) {
  //                         setTextarea(editor.getData());
  //                         settextAreaForLetters(simpleText);
  //                       } else {
  //                         editor.setData(textarea);
  //                       }
  //                     }
  //                   }}
  //                   onFocus={(event: any, editor: any) => {
  //                     setIsFocusing(true);
  //                     setTextarea("");
  //                     editor.setData(textarea);
  //                   }}
  //                   onBlur={(event: any, editor: any) => {
  //                     setIsFocusing(false);
  //                     if (textarea == "") {
  //                       setTextarea("");
  //                       editor.setData("Type something...");
  //                     }
  //                   }}
  //                 />
  //                 <div className="flex items-center w-full justify-end mt-5 gap-5">
  //                   {/* <span
  //                     className={`${
  //                       textAreaForLetters?.length === defaultPostLength
  //                         ? "text-red-600/70"
  //                         : ""
  //                     } font-medium`}
  //                   >
  //                     {textAreaForLetters?.length ?? 0}/{defaultPostLength}
  //                   </span>
  //                   <button className="text-black text-xl">
  //                     <i className="bi bi-paperclip"></i>
  //                   </button>
  //                   <button
  //                     onClick={() => {}}
  //                     id="post-button"
  //                     className="rounded-md bg-blue-700/90 px-5 py-2 shadow-md text-white flex items-center content-center gap-1"
  //                   >
  //                     <i className="bi bi-send-fill"></i>
  //                     Post
  //                   </button>
  //                 </div>
  //               </div> */}
  //               </div>
  //             </div>

  //             {profileUser && profileUser.userPosts.length > 0 ? (

  //               profileUser.userPosts.map((data:any, index) => {
  //                 return (
  //                   <ReplyComponent
  //                     onDelete={() => {}}
  //                     key={index}
  //                     data={data?.post}
  //                   />
  //                 );
  //               })
  //             ) : (
  //               <h1
  //                 id="nothing-message"
  //                 className="text-center mt-20 text-3xl font-bold text-black/50"
  //               >
  //                 Nothing to see here :/
  //               </h1>
  //             )}
  //           </div>
  //           {/* Post Area End */}
  //           <div
  //             id="recommendations"
  //             className="w-1/3 bg-white rounded-md p-3 flex flex-col"
  //           >
  //             <h1 className="text-xl font-semibold">Recommendations</h1>

  //             <div className="items flex flex-col gap-5 mt-5">
  //               <Link to="">
  //                 <div className="user-container flex items-center gap-2">
  //                   <Profile
  //                     radius="50px"
  //                     imageUrl={user.profilePhotoName ?? null}
  //                     letters={user.letters}
  //                     hasStory={true}
  //                     storyBorderWidth="6px"
  //                   />
  //                   <h1 className="text-sm font-medium">Ayxan Abdullayev</h1>
  //                 </div>
  //               </Link>
  //               <Link to="">
  //                 <div className="user-container flex items-center gap-2">
  //                   <Profile radius="50px" letters={`SE`} />
  //                   <h1 className="text-sm font-medium">Steve Enderson</h1>
  //                 </div>
  //               </Link>
  //               <Link to="">
  //                 <div className="user-container flex items-center gap-2">
  //                   <Profile radius="50px" letters={`JS`} />
  //                   <h1 className="text-sm font-medium">Judy Shepherd</h1>
  //                 </div>
  //               </Link>
  //               <Link to="">
  //                 <div className="user-container flex items-center gap-2">
  //                   <Profile radius="50px" letters={`JS`} />
  //                   <h1 className="text-sm font-medium">Judy Shepherd</h1>
  //                 </div>
  //               </Link>
  //               <Link to="">
  //                 <div className="user-container flex items-center gap-2">
  //                   <Profile radius="50px" letters={`JS`} />
  //                   <h1 className="text-sm font-medium">Judy Shepherd</h1>
  //                 </div>
  //               </Link>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //     <footer></footer>
  //   </div>
  // ) : (
  //   <h1>asdasd</h1>
  // );
}

export default memo(PersonDetails);
