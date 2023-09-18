import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Moment from "react-moment";
import { Link } from "react-router-dom";
function ListingItem({ listing, id, oneDelete, oneEdit }) {
  return (
    <li className='bg-white rounded-md shadow-md hover:shadow-lg mb-3 sm:mb-0'>
      <div className='relative overflow-hidden rounded-t-md'>
        <Link to={`/category/${listing.type}/${id}`}>
          <img
            className='h-[170px] object-cover hover:scale-105 duration-200 ease-in-out w-full'
            loading='lazy'
            src={listing.imgUrls[0]}
            alt='thumbnail'
          />
          <div className='absolute top-2 left-2 bg-[#3377cc] uppercase font-semibold text-xs text-white rounded-md px-2 py-1 shadow-lg'>
            <Moment fromNow>{listing.timestamp?.toDate()}</Moment>
          </div>
        </Link>
      </div>
      <div className='px-2 py-1.5'>
        <Link to={`/category/${listing.type}/${id}`}>
          <div>
            {/* Location */}
            <div className='flex items-center gap-1 mb-[2px]'>
              <FaLocationDot className='fill-green-500' size={15} />
              <h1 className='text-gray-600 font-semibold text-sm truncate'>
                {listing.address}
              </h1>
            </div>
            <h1 className='font-semibold truncate text-xl'>{listing.name}</h1>
            <h1 className='font-semibold text-[#457BB3] my-2'>
              $
              {listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" && " / month"}
            </h1>
          </div>
        </Link>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-1.5 font-bold text-xs'>
            <div>
              {listing.bedrooms > 1 ? `${listing.bedrooms}Bed` : "1 Bed"}
            </div>
            <div>
              {listing.bathrooms > 1 ? `${listing.bathrooms}Baths` : "1 Baths"}
            </div>
          </div>
          <div className='flex gap-1.5'>
            {oneEdit && (
              <div className='cursor-pointer'>
                <MdModeEdit onClick={() => oneEdit()} className='fill-black' />
              </div>
            )}
            {oneDelete && (
              <div className='cursor-pointer'>
                <MdDelete
                  onClick={() => oneDelete()}
                  className='fill-red-500'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default ListingItem;
