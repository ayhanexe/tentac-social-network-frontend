import { $CombinedState } from "@reduxjs/toolkit";
import { extend, merge } from "lodash";
import { ReactElement } from "react";

export enum PopupPosition {
  TOP,
  LEFT,
  RIGHT,
  BOTTOM,
}

export interface IPopupAlertService {
  Invoke: (options: IPopupAlertServiceOptions) => void;
  Hide: () => Promise<void>;
  Show: () => Promise<void>;
}

export interface IPopupAlertServiceOptions {
  header?: ReactElement;
  body?: ReactElement;
  footer?: ReactElement;
  title?: string;
  positionIn?: PopupPosition;
  positionOut?: PopupPosition;
  after?: () => any;
}
export interface IPopupAlertServiceOptionsConcrete {
  header: ReactElement;
  body: ReactElement;
  footer: ReactElement;
  title: string;
  positionIn: PopupPosition;
  positionOut: PopupPosition;
  after: () => any;
}

export default class PopupAlertService implements IPopupAlertService {
  constructor() {
    document.addEventListener("click", () => {});
  }

  private _defaultOptions: IPopupAlertServiceOptions = {
    header: <></>,
    body: <></>,
    footer: <></>,
    title: "Title",
    positionIn: PopupPosition.BOTTOM,
    positionOut: PopupPosition.BOTTOM,
    after: () => {},
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
    return extend(
      this._defaultOptions,
      options
    ) as IPopupAlertServiceOptionsConcrete;
  }

  private _generatePopupElement(
    options: IPopupAlertServiceOptions = this._defaultOptions
  ): React.ComponentType {
    const fixedOptions = this._fixOptions(options);
    const fromPosition = this._getPositionClass(fixedOptions.positionIn);
    const toPosition = this._getPositionClass(fixedOptions.positionOut);
    let startPositionClass = "bottom-0";

    switch (fixedOptions.positionIn) {
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

    const element = () => (
      <div className="popup-wrapper w-full h-full fixed top-0 left-0 z-50 backdrop-blur-sm shadow-inner transition-all ease-out duration-150">
        <div
          className={`popup-element active px-3 py-1 rounded-t-xl bg-white shadow-md fixed flex transition-all ease-out duration-150 flex-col justify-start ${startPositionClass} ${`from-${fromPosition}`} ${`to-${toPosition}`}`}
        >
          <h1 className="popup-title text-lg font-bold text-slate-800">
            {options.title}
          </h1>
          <div className="popup-header w-full">{options.header}</div>
          <div className="popup-body flex-grow w-full h-full">
            {options.body}
          </div>
          <div className="popup-footer w-full">{options.footer}</div>
        </div>
      </div>
    );

    return element;
  }

  Show(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const popupWrappers = document.querySelectorAll(".popup-wrapper");

        popupWrappers.forEach((wrapper) => {
          wrapper.classList.remove("hidden");
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async Hide(options?: IPopupAlertServiceOptions): Promise<void> {
    const popupWrappers = document.querySelectorAll(".popup-wrapper");

    popupWrappers.forEach((wrapper) => {
      wrapper.classList.add("hidden");
    });

    if (options?.after) await options.after();
  }

  Invoke(
    options: IPopupAlertServiceOptions = this._defaultOptions
  ): React.ComponentType {
    const Popup = this._generatePopupElement(options);
    return Popup;
  }
}
