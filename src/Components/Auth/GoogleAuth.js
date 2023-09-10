import React from "react";
import { FcGoogle } from "react-icons/fc";

function GoogleAuth() {
  return (
    <>
      <div>
        <button className='flex gap-2 justify-center items-center text-center uppercase w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 px-6 rounded-sm'>
          <div className='bg-white rounded-full p-0.5'>
            <FcGoogle size={25} />
          </div>
          <h1>Continue With Google</h1>
        </button>
      </div>
    </>
  );
}

export default GoogleAuth;
