import { RefObject, useEffect, useRef, useState } from "react";
import Button from "../../@components/Button/Button";
import Input from "../../@components/Input/Input";
import { gsap } from "gsap";

import AuthenticationTypes from "./Authentication.types";
import "./Authentication.scss";

export default function Authentication() {
  const messageAreaRef: RefObject<HTMLDivElement> = useRef(null);
  const formAreaRef: RefObject<HTMLDivElement> = useRef(null);
  const [authenticationType, setAuthenticationType] =
    useState<AuthenticationTypes>(AuthenticationTypes.REGISTER);

  const changeAuthenticationMod = () => {
    if (authenticationType === AuthenticationTypes.LOGIN)
      setAuthenticationType(AuthenticationTypes.REGISTER);
    else setAuthenticationType(AuthenticationTypes.LOGIN);
  };

  useEffect(() => {
    if (authenticationType === AuthenticationTypes.LOGIN) {
      const timeline = gsap.timeline();

      const registerArea = formAreaRef.current?.querySelector("#register-area");
      if (registerArea) {
        gsap.to(registerArea, { opacity: 0 }).then(() => {
          registerArea.classList.add("hidden");
        });
      }

      timeline
        .add("start")
        .to(
          messageAreaRef.current,
          {
            left: "100%",
            transform: "translateX(-100%)",
          },
          "start"
        )
        .to(
          formAreaRef.current,
          {
            left: "-100%",
            transform: "translateX(100%)",
          },
          "start"
        );

      timeline.then(() => {});
    }
  }, [authenticationType]);

  useEffect(() => {});

  return (
    <div id="authentication-root" className="w-screen h-screen flex text-white">
      <div
        ref={messageAreaRef}
        id="message-area"
        className="bg-emerald-900 w-8/12 h-full py-8 px-14 flex flex-col gap-24 relative"
      >
        <div
          id="filter"
          className="z-10 absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-black/20"
        ></div>
        <img
          src="./assets/media/tentac-authentication-page.jpg"
          className="absolute top-0 left-0 w-full h-full object-cover"
          alt=""
        />
        <div
          id="message-area-content"
          className="z-20 w-full h-full flex flex-col gap-20 text-white"
        >
          <a href="/" className="block w-20">
            <img src="./assets/media/tentac-logo.svg" alt="" />
          </a>
          <div id="text-area" className="flex flex-col gap-5">
            <h1 className="text-6xl font-black">
              İstifadəçi hesabınız yoxdur?
            </h1>
            <h4 className="text-xl font-normal">Elə indi qeydiyyatdan keçin</h4>
          </div>
        </div>
      </div>
      <div
        ref={formAreaRef}
        id="form-area"
        className="overflow-y-auto w-full h-full flex flex-col items-center justify-center relative"
      >
        <form
          action="/"
          method="POST"
          id="register-area"
          className="flex flex-col w-6/12 py-7 gap-5"
        >
          <h1 className="text-4xl font-black text-center">QEYDİYYAT</h1>
          <Input id="email" label="Email" placeholder="Email" type="email" />
          <Input
            id="username"
            label="Username"
            placeholder="Username"
            type="text"
          />

          <div className="input-twin-group flex gap-5">
            <Input
              id="password"
              label="Şifrə"
              placeholder="Şifrə"
              type="password"
            />
            <Input
              id="password-again"
              label="Şifrə Təkrar"
              placeholder="Şifrə Təkrar"
              type="password"
            />
          </div>
          <div className="input-twin-group flex gap-5">
            <Input id="name" label="Ad" placeholder="Ad" type="text" />
            <Input id="surname" label="Soyad" placeholder="Soyad" type="text" />
          </div>
          <Input
            id="privacy"
            label="İstifadə şərtləri ilə razıyam"
            type="checkbox"
          />
          <Button type="submit">QEYDİYYATDAN KEÇ</Button>
          <span className="text-xs text-right font-medium">
            Qeydiyyatdan keçmisiniz?{" "}
            <span
              onClick={changeAuthenticationMod}
              className="underline cursor-pointer"
            >
              Giriş et
            </span>
          </span>
        </form>
        <form
          action="/"
          method="POST"
          id="login-area"
          className="flex flex-col w-6/12 py-7 gap-5 hidden"
        >
          <h1 className="text-4xl font-black text-center">GİRİŞ</h1>
          <Input
            id="email-or-username"
            label="Email / İstifadəçi Adı"
            placeholder="Email / İstifadəçi Adı"
            type="text"
          />
          <Input
            id="password"
            label="Şifrə"
            placeholder="Şifrə"
            type="password"
          />
          <Input id="remember-me" label="Məni yadda saxla" type="checkbox" />
          <Button type="submit">GİRİŞ ET</Button>
          <span className="text-xs text-right font-medium">
            Qeydiyyatdan keçməmisiniz?{" "}
            <span
              onClick={changeAuthenticationMod}
              className="underline cursor-pointer"
            >
              Qeydiyyat
            </span>
          </span>
        </form>
      </div>
    </div>
  );
}
