import React from "react";
import { Link } from "react-router-dom";
import GoogleAuth from "../../Components/Auth/GoogleAuth";

function ForgotPassword() {
  return (
    <>
      <div>
        <h1 className='text-center font-bold text-3xl sm:text-4xl my-5 sm:my-8'>
          Forgot Password
        </h1>
      </div>
      <div className='flex sm:block justify-center items-center'>
        <div className='sm:flex px-2 sm:px-5 lg:px-52 gap-0 sm:gap-16 justify-center items-center'>
          <div className='max-w-sm sm:max-w-full sm:w-[50%] mb-5 sm:mb-0'>
            <div className='flex justify-center items-center animate-pulse'>
              <img
                src={require("../../assets/forgot-password.png")}
                alt='Login'
              />
            </div>
          </div>
          <div className='max-w-sm sm:max-w-full sm:w-[50%] text-center'>
            <div className='px-2 md:px-5 sm:px-5 lg:px-10'>
              <form action=''>
                <div className='my-5 rounded-sm'>
                  {/* email */}
                  <input
                    required
                    className='w-full focus:outline-none border-2 focus:border-blue-500 rounded-sm text-lg p-2.5'
                    type='text'
                    placeholder='Email address'
                    name='Email'
                  />
                </div>
                {/* Content */}
                <div className='my-5 rounded-sm flex justify-between text-[13px] sm:text-[17px]'>
                  <div>
                    <h1>
                      Don't have an account?
                      <Link to='/sign-up'>
                        <span className='text-red-600 hover:text-red-700 cursor-pointer'>
                          Register
                        </span>
                      </Link>
                    </h1>
                  </div>
                  <div>
                    <Link to='/sign-in'>
                      <p className='text-blue-500 hover:text-blue-600 cursor-pointer'>
                        Sign in instead
                      </p>
                    </Link>
                  </div>
                </div>
                <div className='text-center'>
                  <button className='uppercase w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-sm'>
                    send reset email
                  </button>
                </div>
              </form>
              <div className='flex gap-1 items-center my-5'>
                <div className='w-[45%] border sm:border-[1.5px]'></div>
                <div className='w-[10%] text-center uppercase'>OR</div>
                <div className='w-[45%] border sm:border-[1.5px]'></div>
              </div>
              <div className='mb-8'>
                <GoogleAuth />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
