import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

function Header() {
  const location = useLocation();
  function pathMatchRoute(params) {
    if (params === location.pathname) {
      return true;
    }
  }

  return (
    <>
      <header>
        <div className='flex justify-between px-2 sm:px-5 lg:px-52 border-b-2 shadow-sm'>
          <div className='py-1.5'>
            <Link to='/'>
              <img
                src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg'
                alt='Logo'
                className='h-5 cursor-pointer'
              />
            </Link>
          </div>
          <div>
            <ul className='flex items-center gap-5'>
              <li
                className={`font-semibold text-gray-400 hover:text-black py-1.5 ${
                  pathMatchRoute("/") &&
                  "text-black border-b-[3px] border-[#D92228]"
                }`}
              >
                <Link to='/'>Home</Link>
              </li>
              <li
                className={`font-semibold text-gray-400 hover:text-black py-1.5 ${
                  pathMatchRoute("/offers") &&
                  "text-black border-b-[3px] border-[#D92228]"
                }`}
              >
                <Link to='/offers'>Offers</Link>
              </li>
              <li
                className={`font-semibold text-gray-400 hover:text-black py-1.5 ${
                  pathMatchRoute("/sign-in") &&
                  "text-black border-b-[3px] border-[#D92228]"
                }`}
              >
                <Link to='/sign-in'>SignIn</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
