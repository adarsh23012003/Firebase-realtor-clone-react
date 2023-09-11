import React from "react";
import loading from "../../assets/Svg/loading-svg.webp";

function LoadingIcon() {
  return (
    <>
      <div className='fixed inset-0 bg-black/10 bg-opacity-10 z-30 flex h-screen w-full justify-center items-center'>
        <img src={loading} alt='' className='h-24' />
      </div>
    </>
  );
}

export default LoadingIcon;
