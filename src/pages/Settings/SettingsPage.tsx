import {
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Profile from "../../@components/Profile/Profile";
import { IUser } from "../../@tentac/types/auth/authTypes";
import { getCurrentUser, getUserProfilePhoto } from "../../utils/Utils";
import moment from "moment";

import "./SettingsPage.scss";
import { Gender } from "../../@tentac/constants/data.constants";
import { isNumber } from "lodash";
import UserService from "../../@tentac/services/user-service/user-service";
import { useSelector } from "react-redux";
import { RootState } from "../../@tentac/redux/store";
import { AlertService } from "../../@tentac/services";
import { Navigate } from "react-router-dom";

export default function SettingsPage() {
  let isUnmounted = false;
  const [user, setUser] = useState<IUser>();
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [letters, setLetters] = useState<string>();
  const state = useSelector((store: RootState) => store.auth);
  const alertService: AlertService = new AlertService();

  const [name, setName] = useState<string>();
  const [surname, setSurname] = useState<string>();
  const [birthdate, setBirthdate] = useState<string>();
  const [gender, setGender] = useState<number>();
  const [telephone, setTelephone] = useState<string>();

  useEffect(() => {
    if (!isUnmounted) {
      (async () => {
        const _user = await getCurrentUser();
        if (_user && !isUnmounted) {
          setUser(_user);
        }
      })();
    }
    return () => {
      isUnmounted = true;
    };
  }, []);

  useEffect(() => {
    if (!isUnmounted) {
      (async () => {
        if (user) {
          const profilePhoto = await getUserProfilePhoto(user).catch(() => {});

          if (profilePhoto && !isUnmounted) setProfilePhoto(profilePhoto);

          if (user.name && user.surname) {
            setLetters(`${user.name[0]}${user.name[0]}`);
          }
        }
      })();
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const userService: UserService = new UserService();

    if (user) {
      const response = await userService
        .update(
          user.id,
          {
            ...user,
            name: name ?? user.name,
            surname: surname ?? user.surname,
            birthDate: birthdate ?? user.birthDate,
            gender: gender ?? user.gender,
            tel: telephone ?? user.tel,
          },
          {
            bearerToken: `${state?.user?.token}`,
            token: `${state?.user?.token}`,
          }
        )
        .then(() => {
          alertService.Success({
            text: "Saved!"
          })
        })
        .catch((error) => {
          alertService.Error({
            text: `${error}`.replace("Error: ", "")
          })
        });
    }
  };

  return (
    <div className="flex flex-col m-10 items-center">
      <form
        method="POST"
        className="profile-update-form flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        <Profile
          radius="150px"
          imageUrl={profilePhoto ?? null}
          letters={letters}
          circleClass="shadow-lg z-10"
          textClass="text-6xl"
          defaultIconClass="text-6xl"
        />
        <h1 className="mt-5">{user?.email}</h1>
        <h1 className="mt-5">{user?.userName ? `@${user.userName}` : null}</h1>
        {user?.name && user?.surname ? (
          <h1 className="mt-2">
            {user?.name} {user?.surname}
          </h1>
        ) : null}
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
  );
}
