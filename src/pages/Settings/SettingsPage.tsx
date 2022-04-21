import {
  BaseSyntheticEvent,
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Profile from "../../@components/Profile/Profile";
import { IAuthUser } from "../../@tentac/types/auth/authTypes";
import { getCurrentUser, getFileFromInput } from "../../utils/Utils";
import moment from "moment";

import "./SettingsPage.scss";
import { Gender } from "../../@tentac/constants/data.constants";
import { isNumber, pick } from "lodash";
import UserService from "../../@tentac/services/user-service/user-service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../@tentac/redux/store";
import { AlertService } from "../../@tentac/services";
import { Navigate } from "react-router-dom";
import Header from "../../@components/Header/Header";
import axios from "axios";
import { addUserInfo } from "../../@tentac/services/authentication-service/state/Authentication.actions";
import path from "path-browserify";

export default function SettingsPage() {
  let isUnmounted = false;
  const dispatch = useDispatch();
  const [user, setUser] = useState<IAuthUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [wallImage, setWallImage] = useState<string>("wall-default.jpg");
  const [letters, setLetters] = useState<string>();
  const state = useSelector((store: RootState) => store.auth);
  const alertService: AlertService = new AlertService();

  const [name, setName] = useState<string>();
  const [surname, setSurname] = useState<string>();
  const [birthdate, setBirthdate] = useState<string>();
  const [gender, setGender] = useState<number>();
  const [telephone, setTelephone] = useState<string>();

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const wallImageInputRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLImageElement>(null);
  const wallImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isUnmounted) {
      (async () => {
        const _user = await getCurrentUser();
        if (_user && !isUnmounted) {
          setUser(_user);
        }
      })();

      profileFileInputRef.current?.addEventListener(
        "change",
        async function (e) {
          const file = await getFileFromInput(this);

          if (profileImageRef.current) {
            profileImageRef.current.src = `${file}`;
          }
        }
      );

      wallImageInputRef.current?.addEventListener("change", async function (e) {
        const file = await getFileFromInput(this);

        if (wallImageRef.current) {
          wallImageRef.current.src = `${file}`;
        }
      });
    }
    return () => {
      isUnmounted = true;
    };
  }, []);

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
      if (profileImageRef.current) {
        profileImageRef.current.src = user.profilePhotoUrl;
      }
    }

    if (user?.userWall) {
      setWallImage(user.userWall);
    }
  }, [user]);

  const handleProfileSelect = (e: BaseSyntheticEvent) => {
    profileFileInputRef.current?.click();
    e.preventDefault();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (user) {
      const userService: UserService = new UserService();
      if (user) {
        await userService.update(
          user.id,
          {
            ...pick(user, [
              "name",
              "surname",
              "id",
              "userName",
              "email",
              "roles",
              "profilePhotoUrl",
              "profilePhotoName",
              "userWall",
              "token",
              "userPosts",
              "userStories",
            ]),
            profilePhoto: user.profilePhotoName,
          },
          {
            bearerToken: `${state?.user?.token}`,
            token: `${state?.user?.token}`,
          }
        );
        await userService
          .update(
            user.id,
            {
              ...user,
              name: name ?? user.name,
              surname: surname ?? user.surname,
              birthDate: birthdate ?? user.birthDate,
              gender: gender ?? user.gender,
              tel: telephone ?? user.tel,
              profilePhoto: user.profilePhotoName,
            },
            {
              bearerToken: `${state?.user?.token}`,
              token: `${state?.user?.token}`,
            }
          )
          .then(async () => {
            if (
              profileFileInputRef.current &&
              profileFileInputRef.current.files &&
              profileFileInputRef.current.files.length != 0
            ) {
              var formData = new FormData();
              formData.append("File", profileFileInputRef.current.files[0]);
              const userService: UserService = new UserService();

              if (user) {
                userService
                  .uploadProfileImage(formData, user.id, {
                    bearerToken: user.token,
                    token: user.token,
                  })
                  .then((imagePath: string) => {
                    console.log("profile image uploaded!");
                    dispatch(
                      addUserInfo({
                        ...user,
                        profilePhotoUrl: `${path.join(
                          `${process.env.REACT_APP_STATIC_FILES_BASE}/media/profiles/`,
                          imagePath
                        )}`,
                        profilePhotoName: imagePath,
                      })
                    );
                  })
                  .catch(() => {});
              }
            }

            if (
              wallImageInputRef.current &&
              wallImageInputRef.current.files &&
              wallImageInputRef.current.files.length > 0
            ) {
              var formData = new FormData();
              formData.append("File", wallImageInputRef.current.files[0]);

              const userService: UserService = new UserService();

              if (user) {
                userService
                  .uploadWallImage(formData, user.id, {
                    bearerToken: user.token,
                    token: user.token,
                  })
                  .then((imagePath: string) => {
                    dispatch(
                      addUserInfo({
                        ...user,
                        userWall: `${path.join(
                          `${process.env.REACT_APP_STATIC_FILES_BASE}/media/walls/`,
                          imagePath
                        )}`,
                      })
                    );
                  })
                  .catch(() => {});
              }
            }

            alertService.Success({
              text: "Saved!",
            });
          })
          .catch((error) => {
            console.log(error);
            alertService.Error({
              text: `${error}`.replace("Error: ", ""),
            });
          });
      }
    }
  };

  const handleWallSelect = (e: BaseSyntheticEvent) => {
    wallImageInputRef.current?.click();
    e.preventDefault();
  };

  return (
    <div className="p-3">
      <Header />
      <div className="flex flex-col m-10 items-center">
        <form
          method="POST"
          className="profile-update-form flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <input ref={profileFileInputRef} type="file" className="hidden" />
          <input ref={wallImageInputRef} type="file" className="hidden" />

          <Profile
            imageRef={profileImageRef}
            radius="150px"
            imageUrl={profilePhoto ?? null}
            letters={letters}
            circleClass="shadow-lg z-10"
            textClass="text-6xl"
            defaultIconClass="text-6xl"
            onClick={handleProfileSelect}
          />
          <h1 className="mt-5">{user?.email}</h1>
          <h1 className="mt-5">
            {user?.userName ? `@${user.userName}` : null}
          </h1>
          {user?.name && user?.surname ? (
            <h1 className="mt-2">
              {user?.name} {user?.surname}
            </h1>
          ) : null}
          <div
            id="wall"
            onClick={handleWallSelect}
            className="overflow-hidden w-full bg-amber-500/10 my-5 rounded-lg"
          >
            <img
              ref={wallImageRef}
              className="w-full h-full object-cover"
              src={path.join(
                `${process.env.REACT_APP_STATIC_FILES_BASE}`,
                `media/walls`,
                wallImage
              )}
              alt=""
            />
          </div>
          <div className="mt-5 flex flex-col w-full items-center">
            <div className="flex flex-col form-group">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="settings-input outline-none rounded-md pl-3 text-sm mt-2"
                placeholder="Name"
                defaultValue={user?.name}
                onChange={(e) => {
                  if (!isUnmounted) setName(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col form-group mt-3">
              <label htmlFor="name" className="text-sm font-medium">
                Surname
              </label>
              <input
                type="text"
                className="settings-input outline-none rounded-md pl-3 text-sm mt-2"
                placeholder="Surname"
                defaultValue={user?.surname}
                onChange={(e) => {
                  if (!isUnmounted) setSurname(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col form-group mt-3">
              <label htmlFor="name" className="text-sm font-medium">
                Birthdate
              </label>
              <input
                type="date"
                className="settings-input outline-none rounded-md pl-3 text-sm mt-2"
                defaultValue={
                  user?.birthDate
                    ? moment(user.birthDate).format("YYYY-MM-DD")
                    : ""
                }
                onChange={(e) => {
                  if (!isUnmounted) setBirthdate(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col form-group mt-3">
              <label htmlFor="name" className="text-sm font-medium">
                Gender
              </label>
              <select
                className="settings-input outline-none rounded-md pl-3 text-sm mt-2"
                onChange={(e) => {
                  if (!isUnmounted) setGender(Number(e.target.value));
                }}
              >
                {user?.gender != null ? (
                  <>
                    <option value={user.gender}>
                      {`${Gender[user.gender]}`.toLowerCase()}
                    </option>
                    {Object.values(Gender)
                      .filter((value: string | number) => !isNumber(value))
                      .map((value, index) => {
                        if (user?.gender != index) {
                          return (
                            <option value={index} key={index}>
                              {`${value}`.toLowerCase()}
                            </option>
                          );
                        }
                      })}
                  </>
                ) : null}
              </select>
            </div>

            <div className="flex flex-col form-group mt-3">
              <label htmlFor="name" className="text-sm font-medium">
                Telephone
              </label>
              <input
                type="tel"
                className="settings-input outline-none rounded-md pl-3 text-sm mt-2"
                placeholder="Telephone"
                defaultValue={user?.tel ?? ""}
                onChange={(e) => {
                  if (!isUnmounted) setTelephone(e.target.value);
                }}
              />
            </div>
          </div>

          <button className="bg-green-700/80 text-white px-5 py-2 w-full mt-5 rounded-md font-medium">
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
}
