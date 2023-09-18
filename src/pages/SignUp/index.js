import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../../Firebase/Firebase";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import GoogleAuth from "../../Components/Auth/GoogleAuth";

function SignUp() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  async function createUser() {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      updateProfile(auth.currentUser, {
        displayName: formData.name,
      });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Account created successfully");
      if (user) {
        navigate("/");
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong with registration");
    }
  }

  return (
    <>
      <div>
        <h1 className='text-center font-bold text-3xl sm:text-4xl my-5 sm:my-8'>
          Sign Up
        </h1>
      </div>
      <div className='flex sm:block justify-center items-center'>
        <div className='sm:flex px-2 sm:px-5 lg:px-52 gap-0 sm:gap-16 justify-center items-center'>
          <div className='max-w-sm sm:max-w-full sm:w-[50%] mb-5 sm:mb-0'>
            <div className='flex justify-center items-center animate-[animateBounce_4s_linear_infinite]'>
              <img
                src={require("../../assets/create-account.png")}
                alt='Login'
              />
            </div>
          </div>
          <div className='max-w-sm sm:max-w-full sm:w-[50%] text-center'>
            <div className='px-2 md:px-5 sm:px-5 lg:px-10'>
              <form>
                <div className='my-5 rounded-sm'>
                  {/* name */}
                  <input
                    required
                    value={formData.name}
                    className='w-full focus:outline-none border-2 focus:border-blue-500 rounded-sm text-lg p-2.5'
                    type='text'
                    placeholder='Full name'
                    name='Name'
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                    }}
                  />
                </div>
                <div className='my-5 rounded-sm'>
                  {/* email */}
                  <input
                    required
                    value={formData.email}
                    className='w-full focus:outline-none border-2 focus:border-blue-500 rounded-sm text-lg p-2.5'
                    type='text'
                    placeholder='Email address'
                    name='Email'
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                  />
                </div>
                <div className='my-5 rounded-sm relative'>
                  {/* password */}
                  <input
                    required
                    value={formData.password}
                    className='w-full focus:outline-none border-2 focus:border-blue-500 rounded-sm text-lg p-2.5'
                    type={showPassword ? "text" : "password"}
                    placeholder='Password'
                    name='password'
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                  />
                  {showPassword ? (
                    <AiFillEyeInvisible
                      size={20}
                      className='cursor-pointer text-black/70 hover:text-black/90 absolute left-[90%] sm:left-[92%] top-[30%]'
                      onClick={() => {
                        setShowPassword(false);
                      }}
                    />
                  ) : (
                    <AiFillEye
                      size={20}
                      className='cursor-pointer text-black/70 hover:text-black/90 absolute left-[90%] sm:left-[92%] top-[30%]'
                      onClick={() => {
                        setShowPassword(true);
                      }}
                    />
                  )}
                </div>
                {/* Content */}
                <div className='my-5 rounded-sm flex justify-between text-[13px] sm:text-[17px]'>
                  <div>
                    <h1>
                      Have an account?
                      <Link to='/sign-in'>
                        <span className='text-red-600 hover:text-red-700 cursor-pointer'>
                          Sign in
                        </span>
                      </Link>
                    </h1>
                  </div>
                  <div>
                    <Link to='/forgot-password'>
                      <p className='text-blue-500 hover:text-blue-600 cursor-pointer'>
                        Forgot password?
                      </p>
                    </Link>
                  </div>
                </div>
                <div className='text-center'>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      createUser();
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                      });
                    }}
                    className='uppercase w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-sm'
                  >
                    Sign Up
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

export default SignUp;
