// import "bootstrap/dist/css/bootstrap.min.css";
import "./style/slider.css";

import MugssBanner from "../img/Mugss Banner.png";
import PostersBanner from "../img/Posters Banner.png";
import StickersBanner from "../img/Stickers Banner.png";

function Slider() {
  const slides = [
    { id: 0, src: MugssBanner, alt: "Mugss Banner" },
    { id: 1, src: PostersBanner, alt: "Posters Banner" },
    { id: 2, src: StickersBanner, alt: "Stickers Banner" },
  ];

  return (
    <div className="main-slider">
      <div className="slider-track">
        <div className="slide-group">
          {slides.map((slide) => (
            <img key={slide.id} src={slide.src} alt={slide.alt} />
          ))}
        </div>

        <div className="slide-group">
          {slides.map((slide) => (
            <img key={`repeat-${slide.id}`} src={slide.src} alt={slide.alt} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
