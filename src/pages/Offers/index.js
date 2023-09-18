import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/Firebase";
import LoadingIcon from "../../Components/UI/LoadingIcon";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { FaLocationDot } from "react-icons/fa6";

function Offers() {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fatchAllData() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      let listing = [];

      querySnap.forEach((doc) => {
        if (doc.data().offer) {
          listing.push({ id: doc.id, data: doc.data() });
        }
      });
      setListing(listing);
      setLoading(false);
    }
    fatchAllData();
  }, []);
  return (
    <>
      {/* LoadingIcon */}
      <div>{loading && <LoadingIcon />}</div>
      <div>
        <h1 className='text-center font-bold text-3xl sm:text-4xl my-5 sm:my-8'>
          Offers
        </h1>
      </div>
      <div className='px-2 sm:px-5 lg:px-52'>
        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mb-10'>
          {listing.map((element, index) => {
            return (
              <li
                key={index}
                className='bg-white rounded-md shadow-md hover:shadow-lg mb-3 sm:mb-0'
              >
                <div className='relative overflow-hidden rounded-t-md'>
                  <Link to={`/category/${element.data.type}/${element.id}`}>
                    <img
                      className='h-[170px] object-cover hover:scale-105 duration-200 ease-in-out w-full'
                      loading='lazy'
                      src={element.data.imgUrls[0]}
                      alt='thumbnail'
                    />
                    <div className='absolute top-2 left-2 bg-[#3377cc] uppercase font-semibold text-xs text-white rounded-md px-2 py-1 shadow-lg'>
                      <Moment fromNow>
                        {element.data.timestamp?.toDate()}
                      </Moment>
                    </div>
                  </Link>
                </div>
                <div className='px-2 py-1.5'>
                  <Link to={`/category/${element.data.type}/${element.id}`}>
                    <div>
                      {/* Location */}
                      <div className='flex items-center gap-1 mb-[2px]'>
                        <FaLocationDot className='fill-green-500' size={15} />
                        <h1 className='text-gray-600 font-semibold text-sm truncate'>
                          {element.data.address}
                        </h1>
                      </div>
                      <h1 className='font-semibold truncate text-xl'>
                        {element.data.name}
                      </h1>
                      <h1 className='font-semibold text-[#457BB3] my-2'>
                        $
                        {element.data.regularPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {element.data.type === "rent" && " / month"}
                      </h1>
                    </div>
                  </Link>
                  <div className='flex justify-between items-center'>
                    <div className='flex space-x-1.5 font-bold text-xs'>
                      <div>
                        {element.data.bedrooms > 1
                          ? `${element.data.bedrooms}Bed`
                          : "1 Bed"}
                      </div>
                      <div>
                        {element.data.bathrooms > 1
                          ? `${element.data.bathrooms}Baths`
                          : "1 Baths"}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Offers;
