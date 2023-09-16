import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { FaShare } from "react-icons/fa";

function Carousel({ data }) {
  const [clipboardMassage, setClipboardMassage] = useState(false);

  return (
    <>
      <div>
        <Swiper
          pagination={{
            type: "progressbar",
          }}
          navigation={true}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          modules={[Autoplay, Pagination, Navigation]}
        >
          {data?.map((element, index) => {
            return (
              <SwiperSlide key={index}>
                <div className=''>
                  <img
                    src={element}
                    alt='images'
                    className='object-cover w-full h-52 sm:h-96'
                  />
                </div>
              </SwiperSlide>
            );
          })}
          <div
            className='fixed z-10 top-[8%] sm:top-[13%] right-[5%] sm:right-[3%] p-2.5 sm:p-3.5 rounded-full cursor-pointer bg-white border-2 border-gray-400 w-10 sm:w-12 h-10 sm:h-12'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setClipboardMassage(true);
              setTimeout(() => {
                setClipboardMassage(false);
              }, 2000);
            }}
          >
            <FaShare className='fill-black/50 text-[16px] sm:text-lg' />
          </div>
          <div
            className={
              clipboardMassage &&
              "fixed z-10 top-[14%] sm:top-[20%] right-[12%] sm:right-[6%] p-1.5 sm:p-2 rounded-xl font-semibold text-sm bg-white border-2 border-gray-400"
            }
          >
            {clipboardMassage && "Link Copied"}
          </div>
        </Swiper>
      </div>
    </>
  );
}

export default Carousel;
