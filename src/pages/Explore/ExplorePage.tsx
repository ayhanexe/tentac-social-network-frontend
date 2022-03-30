import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../@components/Header/Header";
import UserService from "../../@tentac/services/user-service/user-service";
import { IAuthUser, IUserInfo } from "../../@tentac/types/auth/authTypes";
import { getCurrentUser } from "../../utils/Utils";
import "./ExplorePage.scss";

export default function ExplorePage() {
  let isUnmounted = false;
  const [authUser, setAuthUser] = useState<IAuthUser | null>();
  const [users, setUsers] = useState<IUserInfo[]>();
  const dummyData: IUserInfo[] = [
    {
      id: "0",
      name: "Ayxan",
      surname: "Abdullayev",
      email: "ayxan@tentac.com",
      roles: ["admin"],
      profilePhotos: [
        {
          id: 0,
          photo: `https://assets3.thrillist.com/v1/image/2858077/828x1500/flatten;scale;webp=auto;jpeg_quality=60.jpg`,
          createDate: new Date().toString(),
          deleteDate: null,
          isDeleted: false,
          lastModificationDate: null,
          userId: "0",
        },
      ],
      userWalls: [],
      userName: "Admin",
      gender: 0,
    },
    {
      id: "1",
      name: "Ayxan",
      surname: "Abdullayev",
      email: "ayxan@tentac.com",
      roles: ["admin"],
      profilePhotos: [
        {
          id: 0,
          photo: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80`,
          createDate: new Date().toString(),
          deleteDate: null,
          isDeleted: false,
          lastModificationDate: null,
          userId: "1",
        },
      ],
      userWalls: [],
      userName: "Admin",
      gender: 0,
    },
    {
      id: "2",
      name: "Ayxan",
      surname: "Abdullayev",
      email: "ayxan@tentac.com",
      roles: ["admin"],
      profilePhotos: [
        {
          id: 0,
          photo: `https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80`,
          createDate: new Date().toString(),
          deleteDate: null,
          isDeleted: false,
          lastModificationDate: null,
          userId: "2",
        },
      ],
      userWalls: [],
      userName: "Admin",
      gender: 0,
    },
    {
      id: "3",
      name: "Ayxan",
      surname: "Abdullayev",
      email: "ayxan@tentac.com",
      roles: ["admin"],
      profilePhotos: [
        {
          id: 0,
          photo: `https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=696&q=80`,
          createDate: new Date().toString(),
          deleteDate: null,
          isDeleted: false,
          lastModificationDate: null,
          userId: "3",
        },
      ],
      userWalls: [],
      userName: "Admin",
      gender: 0,
    },
    {
      id: "4",
      name: "Ayxan",
      surname: "Abdullayev",
      email: "ayxan@tentac.com",
      roles: ["admin"],
      profilePhotos: [
        {
          id: 0,
          photo: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80`,
          createDate: new Date().toString(),
          deleteDate: null,
          isDeleted: false,
          lastModificationDate: null,
          userId: "4",
        },
      ],
      userWalls: [],
      userName: "Admin",
      gender: 0,
    },
    {
      id: "5",
      name: "Ayxan",
      surname: "Abdullayev",
      email: "ayxan@tentac.com",
      roles: ["admin"],
      profilePhotos: [
        {
          id: 0,
          photo: `https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80`,
          createDate: new Date().toString(),
          deleteDate: null,
          isDeleted: false,
          lastModificationDate: null,
          userId: "5",
        },
      ],
      userWalls: [],
      userName: "Admin",
      gender: 0,
    },
  ];

  useEffect(() => {
    const userService: UserService = new UserService();

    (async () => {
      const _user: IAuthUser | null = await getCurrentUser();
      setAuthUser(_user);

      if (_user) {
        const users = await userService.getAll({
          bearerToken: `${_user.token}`,
        });

        if (users && !isUnmounted) {
          setUsers(users);
        }
      }
    })();

    return () => {
      isUnmounted = true;
    };
  }, []);

  return (
    <div className="p-3">
      <Header />
      <div className="profiles-container py-5">
        {dummyData.map((data, index) => {
          return (
            <Link to={`/user-details/${data.id}`} key={index}>
              <div className="profile-item relative shadow-lg">
                <div className="image-container w-full h-full relative rounded-md overflow-hidden">
                  <img
                    src={`${data.profilePhotos[0]?.photo}`}
                    className="w-full h-full object-cover absolute top-0 left-0 z-0"
                  />
                </div>
                <span className="z-10 absolute -bottom-2 text-center w-full translate-y-full text-md font-medium">
                  {data.name} {data.surname}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
