import { flatMapDepth, isObject } from "lodash";

export default function ClearStyleAttribute(element?: Element | null) {
  element?.setAttribute("style", "");
}

export function GetPropertyPath(
  object: { [key: string]: any },
  key: string,
  memo: string = ""
) {
  let _memo = memo;
  Object.keys(object).map((objKey: string, index: number) => {
    _memo = `${memo === "" ? "" : `${memo}.`}${objKey}`;
    if (isObject(object[objKey])) {
      _memo = GetPropertyPath(object[objKey], key, _memo);
    }
  });
  return _memo;
}
