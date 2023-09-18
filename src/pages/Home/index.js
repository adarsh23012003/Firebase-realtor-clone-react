import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/Firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import LoadingIcon from "../../Components/UI/LoadingIcon";
import { useNavigate } from "react-router";
import Moment from "react-moment";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingOffers, setListingOffers] = useState([]);
  const [listingForSale, setListingForSale] = useState([]);
  const [listingForRent, setListingForRent] = useState([]);

  useEffect(() => {
    async function fatchData() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listing = [];

      querySnap.forEach((doc) => {
        listing.push({ id: doc.id, data: doc.data() });
      });
      setListings(listing);
      setLoading(false);
    }
    fatchData();
  }, []);

  useEffect(() => {
    async function fatchAllData() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      let offerListing = [];
      let rentListing = [];
      let forSaleListing = [];
      querySnap.forEach((doc) => {
        if (doc.data().type === "rent") {
          if (rentListing.length !== 4) {
            rentListing.push({ id: doc.id, data: doc.data() });
          }
        }
        if (doc.data().type === "sell") {
          if (forSaleListing.length !== 4) {
            forSaleListing.push({ id: doc.id, data: doc.data() });
          }
        }
        if (doc.data()?.offer) {
          if (offerListing.length !== 4) {
            offerListing.push({ id: doc.id, data: doc.data() });
          }
        }
      });
      setListingForRent(rentListing);
      setListingForSale(forSaleListing);
      setListingOffers(offerListing);
      setLoading(false);
    }
    fatchAllData();
  }, []);

  return (
    <>
      {/* LoadingIcon */}
      <div>{loading && <LoadingIcon />}</div>
      {/* Carousel */}
      <div>
        <Swiper
          pagination={{
            type: "bullets",
            clickable: true,
          }}
          navigation={true}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          modules={[Autoplay, Pagination, Navigation]}
        >
          {listings?.map((element) => {
            return (
              <>
                <SwiperSlide
                  className='cursor-pointer'
                  key={element.id}
                  onClick={() => {
                    navigate(`/category/${element.data.type}/${element.id}`);
                  }}
                >
                  <div>
                    <img
                      src={element?.data?.imgUrls[0]}
                      alt='images'
                      className='relative object-cover w-full h-52 sm:h-96'
                    />
                  </div>
                  {element?.data?.name && (
                    <p className='bg-[#4A7997] font-medium text-white text-sm absolute left-1 top-3 max-w-[90%] shadow-lg opacity-90 p-2 rounded-br-3xl z-10'>
                      {element?.data?.name}
                    </p>
                  )}
                  {element?.data?.regularPrice && (
                    <p className='bg-red-400 font-medium text-white text-sm absolute left-1 bottom-1 max-w-[90%] shadow-lg opacity-90 p-2 rounded-tr-3xl z-10'>
                      $
                      {element?.data?.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      {element?.data?.type === "rent" && " / month"}
                    </p>
                  )}
                </SwiperSlide>
              </>
            );
          })}
        </Swiper>
      </div>
      {!loading && (
        <div className='px-2 sm:px-5 lg:px-52'>
          {/* Recent offers */}
          <div>
            <h1 className='font-semibold text-lg sm:text-2xl'>Resent offers</h1>
            <p
              className='text-blue-500 hover:text-blue-700 text-sm cursor-pointer pb-2.5'
              onClick={() => navigate("/offers")}
            >
              Show offers
            </p>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mb-10'>
              {listingOffers.map((element) => {
                return (
                  <li className='bg-white rounded-md shadow-md hover:shadow-lg mb-3 sm:mb-0'>
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
                            <FaLocationDot
                              className='fill-green-500'
                              size={15}
                            />
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
          {/* Places for rent */}
          <div>
            <h1 className='font-semibold text-lg sm:text-2xl'>
              Places for rent
            </h1>
            <p
              className='text-blue-500 hover:text-blue-700 text-sm cursor-pointer pb-2.5'
              onClick={() => navigate("/category/rent")}
            >
              Show more places for rent
            </p>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mb-10'>
              {listingForRent.map((element) => {
                return (
                  <li className='bg-white rounded-md shadow-md hover:shadow-lg mb-3 sm:mb-0'>
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
                            <FaLocationDot
                              className='fill-green-500'
                              size={15}
                            />
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
          {/* Places for sale */}
          <div>
            <h1 className='font-semibold text-lg sm:text-2xl'>
              Places for sale
            </h1>
            <p
              className='text-blue-500 hover:text-blue-700 text-sm cursor-pointer pb-2.5'
              onClick={() => navigate("/category/sell")}
            >
              Show more places for sale
            </p>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mb-10'>
              {listingForSale.map((element) => {
                return (
                  <li className='bg-white rounded-md shadow-md hover:shadow-lg mb-3 sm:mb-0'>
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
                            <FaLocationDot
                              className='fill-green-500'
                              size={15}
                            />
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
        </div>
      )}
    </>
  );
}

export default Home;
