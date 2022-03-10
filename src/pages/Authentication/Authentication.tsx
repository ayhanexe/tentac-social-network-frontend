import { RefObject, useEffect, useRef, useState } from "react";
import Button from "../../@components/Button/Button";
import Input from "../../@components/Input/Input";
import { gsap } from "gsap";

import AuthenticationTypes from "./Authentication.types";
import "./Authentication.scss";
import ClearStyleAttribute from "../../utils/Utils";

export default function Authentication() {
  const messageAreaRef: RefObject<HTMLDivElement> = useRef(null);
  const formAreaRef: RefObject<HTMLDivElement> = useRef(null);
  const [authenticationType, setAuthenticationType] =
    useState<AuthenticationTypes>(AuthenticationTypes.LOGIN);

  const setLoginPage = (
    timeline: GSAPTimeline,
    loginArea: Element,
    registerArea: Element,
    isImmediately: boolean = false
  ) => {
    const logo = messageAreaRef.current?.querySelector("#logo");
    const message = messageAreaRef.current?.querySelector("#message");
    loginArea.classList.remove("hidden");

    if (isImmediately) {
      registerArea.classList.add("hidden");
      if (logo) {
        gsap.set(logo, {
          left: "100%",
          transform: "translate(-100%)",
        });
      }
      if (message) {
        message.innerHTML = `<h1 class="text-4xl lg:text-6xl font-black relative">Giriş et və Tentac platformasından tam şəkildə yararlan</h1>`;
      }
      gsap.set(loginArea, { opacity: 1 });
      messageAreaRef.current?.classList.add("message-right");
      formAreaRef.current?.classList.add("form-left");
      
      ClearStyleAttribute(messageAreaRef.current)
      ClearStyleAttribute(formAreaRef.current)
      
    } else {
      gsap.set(loginArea, { opacity: 0 });
      if (logo) {
        gsap.to(logo, {
          left: "100%",
          transform: "translateX(-100%)",
        });
      }
      if (message) {
        gsap
          .to(message, {
            opacity: 0,
          })
          .then(() => {
            message.innerHTML = `<h1 class="text-4xl lg:text-6xl font-black relative">Giriş et və Tentac platformasından tam şəkildə yararlan</h1>`;
            gsap.to(message, {
              opacity: 1,
            });
          });
      }
      timeline.to(registerArea, { opacity: 0 }, "start")
      timeline.to(loginArea, { opacity: 1 }, "start")
      timeline
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
        )
        .then(() => {
          registerArea.classList.add("hidden");
          messageAreaRef.current?.classList.remove("message-left");
          formAreaRef.current?.classList.remove("form-right");
          messageAreaRef.current?.classList.add("message-right");
          formAreaRef.current?.classList.add("form-left");
          ClearStyleAttribute(messageAreaRef.current);
          ClearStyleAttribute(formAreaRef.current);
        });
    }
  };

  const setRegisterPage = (
    timeline: GSAPTimeline,
    loginArea: Element,
    registerArea: Element
  ) => {
    const logo = messageAreaRef.current?.querySelector("#logo");
    const message = messageAreaRef.current?.querySelector("#message");

    if (logo) {
      gsap.to(logo, {
        left: "0%",
        transform: "translateX(0%)",
      });
    }
    if (message) {
      gsap
        .to(message, {
          opacity: 0,
        })
        .then(() => {
          message.innerHTML = `
          <h1 class="text-4xl lg:text-6xl font-black relative">
                İstifadəçi hesabınız yoxdur?
              </h1>
              <h4 class="text-xl font-normal mt-4">
                Elə indi qeydiyyatdan keçin
              </h4>`;
          gsap.to(message, {
            opacity: 1,
          });
        });
    }

    registerArea.classList.remove("hidden");
    timeline.to(loginArea, { opacity: 0 }, "start")
    timeline.to(registerArea, { opacity: 1 }, "start");
    timeline
      .fromTo(
        messageAreaRef.current,
        {
          left: "100%",
          transform: "translateX(-100%)",
        },
        {
          left: "0%",
          transform: "translateX(0%)",
        },
        "start"
      )
      .fromTo(
        formAreaRef.current,
        {
          left: "-100%",
          transform: "translateX(100%)",
        },
        {
          left: "0%",
          transform: "translateX(0%)",
        },
        "start"
      )
      .then(() => {
        loginArea.classList.add("hidden");
        messageAreaRef.current?.classList.remove("message-right");
        formAreaRef.current?.classList.remove("form-left");
        messageAreaRef.current?.classList.add("message-left");
        formAreaRef.current?.classList.add("form-right");
        ClearStyleAttribute(messageAreaRef.current);
        ClearStyleAttribute(formAreaRef.current);
      });
  };

  const changeAuthenticationMode = () => {
    const timeline = gsap.timeline();
    timeline.add("start");

    const registerArea = formAreaRef.current?.querySelector("#register-area");
    const loginArea = formAreaRef.current?.querySelector("#login-area");

    if (authenticationType === AuthenticationTypes.LOGIN) {
      setAuthenticationType(AuthenticationTypes.REGISTER);
      if (loginArea && registerArea)
        setRegisterPage(timeline, loginArea, registerArea);
    } else {
      setAuthenticationType(AuthenticationTypes.LOGIN);
      if (loginArea && registerArea)
        setLoginPage(timeline, loginArea, registerArea);
    }
  };

  useEffect(() => {
    const timeline = gsap.timeline();
    timeline.add("start");

    const registerArea = formAreaRef.current?.querySelector("#register-area");
    const loginArea = formAreaRef.current?.querySelector("#login-area");

    if (authenticationType === AuthenticationTypes.LOGIN) {
      if (loginArea && registerArea)
        setLoginPage(timeline, loginArea, registerArea, true);
    }
  }, []);

  return (
    <div
      id="authentication-root"
      className="top-0 left-0 w-screen h-screen overflow-hidden flex text-white"
    >
      <div
        ref={messageAreaRef}
        id="message-area"
        className="w-3/6 h-screen py-8 px-14 hidden md:flex flex-col gap-24 relative"
      >
        <div
          id="filter"
          className="z-10 absolute top-0 left-0 w-full h-full backdrop-blur-sm"
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
          <a id="logo" href="/" className="block w-20 relative">
            <img src="./assets/media/tentac-logo.svg" alt="" />
          </a>
          <div id="text-area" className="flex flex-col gap-5">
            <div id="message">
              <h1 className="text-4xl lg:text-6xl font-black relative">
                İstifadəçi hesabınız yoxdur?
              </h1>
              <h4 className="text-xl font-normal mt-4">
                Elə indi qeydiyyatdan keçin
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={formAreaRef}
        id="form-area"
        className="w-full lg:w-5/6 h-screen overflow-y-auto flex flex-col relative mx-auto"
      >
        <form
          action="/"
          method="POST"
          id="register-area"
          className="overflow-y-auto flex flex-col w-full justify-center z-10 py-7 px-10 lg:px-24 xl:px-40 gap-5 absolute"
        >
          <h1 className="text-4xl font-black text-center">QEYDİYYAT</h1>
          <Input id="email" label="Email" placeholder="Email" type="email" />
          <Input
            id="username"
            label="Username"
            placeholder="Username"
            type="text"
          />

          <div className="input-twin-group flex-col lg:flex-row  flex gap-5">
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
          <div className="input-twin-group flex-col lg:flex-row flex gap-5 w-full">
            <Input id="name" label="Ad" placeholder="Ad" type="text" />
            <Input id="surname" label="Soyad" placeholder="Soyad" type="text" />
          </div>
          <Input
            id="privacy"
            labelclass="hover:cursor-pointer"
            label="İstifadə şərtləri ilə razıyam"
            type="checkbox"
          />
          <Button type="submit">QEYDİYYATDAN KEÇ</Button>
          <span className="text-xs text-right font-medium">
            Qeydiyyatdan keçmisiniz?{" "}
            <span
              onClick={changeAuthenticationMode}
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
          className="hidden overflow-y-auto flex justify-center z-10 flex-col w-full h-full py-7 px-10 xl:px-40 gap-5 absolute"
        >
          <h1 className="text-4xl font-black text-center">GİRİŞ</h1>
          <Input
            id="email-or-username"
            label="Email / İstifadəçi Adı"
            placeholder="Email / İstifadəçi Adı"
            type="text"
          />
          <Input
            id="login-password"
            label="Şifrə"
            placeholder="Şifrə"
            type="password"
          />
          <Input
            id="remember-me"
            labelclass="hover:cursor-pointer"
            label="Məni yadda saxla"
            type="checkbox"
          />
          <Button type="submit">GİRİŞ ET</Button>
          <span className="text-xs text-right font-medium">
            Qeydiyyatdan keçməmisiniz?{" "}
            <span
              onClick={changeAuthenticationMode}
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
