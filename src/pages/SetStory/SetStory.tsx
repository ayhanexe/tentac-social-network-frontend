import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import path from "path-browserify";
import { useRef, useState } from "react";
import Header from "../../@components/Header/Header";
import { defaultPostLength } from "../../@tentac/constants/config.constants";
import { removeHtmlTagsFromString } from "../../utils/Utils";
import "./SetStory.scss";

const { CKEditor } = require("@ckeditor/ckeditor5-react");

const SetStory = () => {
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [textarea, setTextarea] = useState<string>("");
  const [textAreaForLetters, settextAreaForLetters] = useState<string>("");
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const imageRef = useRef(null);

  const handleImageSelect = () => {
    
  };

  return (
    <div className="flex flex-col p-5">
      <Header />
      <h1 className="text-3xl font-bold my-4">Stories</h1>
      <div className="story-wrapper flex gap-3">
        <input ref={imageRef} type="file" className="hidden" />
        <div
          onClick={handleImageSelect}
          className="story-item flex items-center justify-center bg-white shadow-md rounded-md relative overflow-hidden opacity-50 hover:opacity-100 cursor-pointer transition-all duration-300 ease-out"
        >
          <img
            id="story-image"
            className="w-full h-full object-cover absolute top-0 left-0 z-10"
            src={path.join(
              `${process.env.REACT_APP_STATIC_FILES_BASE}`,
              "media/stories",
              "default-story.jpg"
            )}
          />
          <i className="bi bi-plus-circle-fill absolute z-20 text-3xl text-white"></i>
        </div>
        <form action="" className="h-full w-full">
          <div className="pl-5 py-3 bg-white form-div">
            <label className="text-xl font-bold">Post</label>
            <CKEditor
              editor={ClassicEditor}
              data="<p>Type something...</p>"
              onChange={(event: any, editor: any) => {
                if (!isInitial || isFocusing) {
                  const simpleText = removeHtmlTagsFromString(editor.getData());
                  if (simpleText.length <= defaultPostLength) {
                    setTextarea(editor.getData());
                    settextAreaForLetters(simpleText);
                  } else {
                    editor.setData(textarea);
                  }
                }
              }}
              onFocus={(event: any, editor: any) => {
                setIsFocusing(true);
                setTextarea("");
                editor.setData(textarea);
              }}
              onBlur={(event: any, editor: any) => {
                setIsFocusing(false);
                if (textarea == "") {
                  setTextarea("");
                  editor.setData("Type something...");
                }
              }}
            />
            <button className="bg-green-500 py-1 px-2 rounded-md text-white">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetStory;
