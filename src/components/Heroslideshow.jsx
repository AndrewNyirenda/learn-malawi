import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import students from "../images/students.jpg";
import student from "../images/student.jpg";
import people from "../images/people.jpg";

const Heroslideshow = () => {
  const images = [students, student, people];

  return (
    <div className="hero-slideshow-wrapper">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ 
          delay: 4000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        loop={true}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        navigation={true}
        slidesPerView={1}
        speed={800}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} style={{ height: "100%" }}>
            <div style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
        
            }}>
              <img 
                src={img} 
                alt={`Hero ${index + 1}`} 
                className="slide-image"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // Show full image
                  maxHeight: "100%",
                  maxWidth: "100%"
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Heroslideshow;