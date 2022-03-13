import {
  BaseSyntheticEvent,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import IInput from "./Input.types";

export default function Input(props: IInput) {
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const fakeCheckbox: RefObject<HTMLLabelElement> = useRef(null);
  const [passwordShow, setPasswordShow] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(
    props.checked ?? false
  );

  const togglePassword = () => {
    setPasswordShow(!passwordShow);
    inputRef.current?.setAttribute(
      "type",
      `${passwordShow ? "password" : "text"}`
    );
  };

  const toggleCheckbox = () => {
    fakeCheckbox.current?.classList.toggle("active");
  };

  useEffect(() => {
    inputRef.current?.addEventListener(
      "change",
      () => {
        if (inputRef.current) setCheckboxChecked(inputRef.current.checked);
      },
      {}
    );
  }, []);

  useEffect(() => {
    if (checkboxChecked) {
      fakeCheckbox.current?.classList.add("active");
    } else {
      fakeCheckbox.current?.classList.remove("active");
    }
  }, [checkboxChecked]);

  const defaultInput = (
    <div
      className={`input-group w-full flex ${
        props.type !== "checkbox"
          ? "flex-col"
          : "flex-row-reverse items-center gap-2"
      } relative`}
      style={{
        justifyContent: props.type === "checkbox" ? "start" : "",
      }}
    >
      <label htmlFor={props.id} className={`text-sm font-semibold`}>
        {props.label}
      </label>
      {props.type === "checkbox" ? (
        <label
          onClick={toggleCheckbox}
          ref={fakeCheckbox}
          htmlFor={props.id}
          className={`input-checkbox ${
            props.labelclass ? `${props.labelclass} ` : ""
          }`}
        ></label>
      ) : null}
      <input
        ref={inputRef}
        id={props.id}
        type={props.type}
        name={props.name}
        className={`${props.className ? `${props.className} ` : ""}${
          props.type === "checkbox" ? "hidden" : "input-control"
        } px-3 text-sm outline-none w-full`}
        {...props}
        onChange={props.onChange}
      />
      {props.type === "password" ? (
        <i
          onClick={togglePassword}
          className={`bi bi-eye${
            passwordShow ? "-slash-" : "-"
          }fill absolute top-1/2 right-3 opacity-50 hover:cursor-pointer hover:opacity-100 transition-all`}
        ></i>
      ) : null}
    </div>
  );

  switch (props.type) {
    case "checkbox":
      return defaultInput;
    default:
      return defaultInput;
  }
}
