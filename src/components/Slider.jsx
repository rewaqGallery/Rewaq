// import React, { useState, useEffect } from "react";
// import "./style/slider.css";

// import MugssBanner from "../img/Mugss Banner.png";
// import PostersBanner from "../img/Posters Banner.png";
// import StickersBanner from "../img/Stickers Banner.png";
// import StickersBanner2 from "../img/Stickers Banner 2.png";

// function Slider() {
//   const slides = [
//     { id: 0, src: MugssBanner, alt: "Mugss Banner" },
//     { id: 1, src: PostersBanner, alt: "Posters Banner" },
//     { id: 2, src: StickersBanner, alt: "Stickers Banner" },
//     { id: 3, src: StickersBanner2, alt: "Stickers Banner 2" },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [slides.length]);

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   const goToPrevious = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
//   };

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//   };

//   return (
//     <div className="main-slider">
//       <div className="carousel-container">
//         {slides.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
//           >
//             <img
//               className="d-block w-100"
//               src={slide.src}
//               alt={slide.alt}
//             />
//           </div>
//         ))}

//         <button
//           className="carousel-control-prev"
//           onClick={goToPrevious}
//           aria-label="Previous slide"
//         >
//           <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//         </button>

//         <button
//           className="carousel-control-next"
//           onClick={goToNext}
//           aria-label="Next slide"
//         >
//           <span className="carousel-control-next-icon" aria-hidden="true"></span>
//         </button>

//         <div className="carousel-indicators">
//           {slides.map((slide, index) => (
//             <button
//               key={slide.id}
//               className={index === currentIndex ? "active" : ""}
//               onClick={() => goToSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             ></button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Slider;


import "bootstrap/dist/css/bootstrap.min.css";
import "./style/slider.css";

import MugssBanner from "../img/Mugss Banner.png";
import PostersBanner from "../img/Posters Banner.png";
import StickersBanner from "../img/Stickers Banner.png";
import StickersBanner2 from "../img/Stickers Banner 2.png";

function Slider() {
  const slides = [
    { id: 0, src: MugssBanner, alt: "Mugss Banner" },
    { id: 1, src: PostersBanner, alt: "Posters Banner" },
    { id: 2, src: StickersBanner, alt: "Stickers Banner" },
    { id: 3, src: StickersBanner2, alt: "Stickers Banner 2" },
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
