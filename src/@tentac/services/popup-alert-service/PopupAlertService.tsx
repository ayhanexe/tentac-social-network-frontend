import { merge } from "lodash";
import { ReactElement } from "react";
import ReactDOM from "react-dom";
import { RootState, store } from "../../redux/store";
import { setShowing } from "./state/Popup.actions";

export enum PopupPosition {
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
}

export interface IPopupAlertService {
  Invoke: (options: IPopupAlertServiceOptions) => void;
}

export interface IPopupAlertServiceOptions {
  header?: ReactElement;
  body?: ReactElement;
  footer?: ReactElement;
  title?: string;
  positionIn?: PopupPosition;
  positionOut?: PopupPosition;
}
export interface IPopupAlertServiceOptionsConcrete {
  header: ReactElement;
  body: ReactElement;
  footer: ReactElement;
  title: string;
  positionIn: PopupPosition;
  positionOut: PopupPosition;
}

export default class PopupAlertService implements IPopupAlertService {
  private _defaultOptions: IPopupAlertServiceOptions = {
    header: <></>,
    body: <></>,
    footer: <></>,
    title: "Title",
    positionIn: PopupPosition.BOTTOM,
    positionOut: PopupPosition.BOTTOM,
  };

  private _getPositionClass(position: PopupPosition) {
    switch (position) {
      case PopupPosition.BOTTOM:
        return "bottom";
        break;
      case PopupPosition.LEFT:
        return "left";
        break;
      case PopupPosition.RIGHT:
        return "right";
        break;
      case PopupPosition.TOP:
        return "top";
        break;
    }
  }

  private _fixOptions(options: IPopupAlertServiceOptions) {
    return merge(
      {},
      options,
      this._defaultOptions
    ) as IPopupAlertServiceOptionsConcrete;
  }

  private _generatePopupElement(
    options: IPopupAlertServiceOptions = this._defaultOptions
  ): ReactElement {
    const fixedOptions = this._fixOptions(options);
    const fromPosition = this._getPositionClass(fixedOptions.positionIn);
    const toPosition = this._getPositionClass(fixedOptions.positionOut);
    const _store: RootState = store.getState();
    store.dispatch(setShowing(true));
    let startPositionClass = "bottom-0";

    switch (options.positionIn) {
      case PopupPosition.TOP:
        startPositionClass = "top-0 left-1/2 -translate-x-2/4";
        break;
      case PopupPosition.LEFT:
        startPositionClass = "left-0 top-1/2 -translate-y-2/4";
        break;
      case PopupPosition.RIGHT:
        startPositionClass = "right-0 top-1/2 -translate-y-2/4";
        break;
      case PopupPosition.BOTTOM:
        startPositionClass = "bottom-0 left-1/2 -translate-x-2/4";
        break;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add(
      "popup-wrapper",
      "w-full",
      "h-full",
      "fixed",
      "top-0",
      "left-0",
      "z-50",
      "backdrop-blur-sm",
      "shadow-inner",
      "transition-all",
      "ease-out",
      "duration-150"
    );

    const element = (
      <div
        className={`popup-element px-3 py-1 rounded-t-xl bg-white shadow-md fixed flex transition-all ease-out duration-150 flex-col ${startPositionClass} ${`from-${fromPosition}`} ${`to-${toPosition}`}`}
      >
        <h1 className="popup-title text-lg font-bold text-slate-800">
          ${options.title}
        </h1>
        <div className="popup-header">{options.header}</div>
        <div className="popup-body">{options.body}</div>
        <div className="popup-footer">{options.footer}</div>
      </div>
    );

    if (!_store.popup.isShowing) {
      document.body.appendChild(wrapper);
      const domWrapper = document.querySelector(".popup-wrapper");
      if (domWrapper) {
        // domWrapper.innerHTML = element;
      }
    }

    return element;
  }

  Invoke(
    options: IPopupAlertServiceOptions = this._defaultOptions
  ): ReactElement {
    return this._generatePopupElement(options);
  }
}
