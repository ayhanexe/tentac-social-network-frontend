import "./HomeStoriesSlider.scss";
import { memo, useEffect, useState } from "react";
import TinySliderReact from "tiny-slider-react";
import "tiny-slider/dist/tiny-slider.css";
import { generateColor } from "../../utils/Utils";

function HomeStoriesSlider() {
  const [dummyData, setDummyData] = useState<any[]>();

  const sliderSettings = {
    nav: false,
    mouseDrag: true,
    items: 5,
    gutter: 10,
  };

  useEffect(() => {
    setDummyData([
      {
        id: 1,
        imageUrl:
          "https://img.static-kl.com/images/media/757F62E5-562A-4EB9-ABEA83C5EB615F50?aspect_ratio=1:1&min_width=456",
        randomColor: generateColor(true, 0.5),
      },
      {
        id: 1,
        imageUrl:
          "https://i.pinimg.com/originals/63/84/d7/6384d7e625f9650ca4fc49b98882229a.jpg",
        randomColor: generateColor(true, 0.5),
      },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-1 font-bold">Stories</h1>
      {dummyData ? (
        <TinySliderReact settings={sliderSettings}>
          {dummyData.map((data, index) => (
            <div className="slider-item-wrapper" key={data.id}>
              <div
                className={`slider-item cursor-pointer opacity-50 hover:opacity-100 transition-opacity ease-in-out duration-300 h-full rounded-md overflow-hidden`}
                style={{
                  backgroundColor: data.randomColor,
                }}
              >
                <img
                  src={data.imageUrl}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </TinySliderReact>
      ) : null}
    </div>
  );
}

export default memo(HomeStoriesSlider);
