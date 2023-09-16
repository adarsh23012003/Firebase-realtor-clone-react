import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import LoadingIcon from "../Components/UI/LoadingIcon";
import Carousel from "../Components/UI/Carousel";
import { FaLocationDot } from "react-icons/fa6";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Listing() {
  const [listingData, setListingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const param = useParams();
  const [contactLandlord, setContactLandlord] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function getUserListingData() {
      try {
        if (doc) {
          const docRef = doc(db, "listings", param.listingId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setListingData(docSnap.data());
            setLoading(false);
          }
          // console.log(docSnap.data());
        }
      } catch (e) {
        toast.error("Something went wrong");
        console.log(e);
      }
    }
    getUserListingData();
  }, [param.listingId]);
  console.log(listingData.geoLocation);

  return (
    <>
      {/* Loading */}
      <div>{loading && <LoadingIcon />}</div>
      <div>
        <Carousel data={listingData.imgUrls} />
        <div className='px-2 sm:px-5 lg:px-52'>
          <div className='sm:flex sm:h-[60vh] gap-5 my-5 rounded-md bg-white'>
            <div className='w-full sm:w-[50%] px-5 py-6'>
              {/* Name and Price */}
              <div className='text-[#457BB3] y-2 font-bold text-2xl flex gap-2'>
                <h1>{listingData.name}</h1>
                <h1>
                  $
                  {listingData?.regularPrice &&
                    listingData?.regularPrice
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {listingData.type === "rent" && " / month"}
                </h1>
              </div>
              {/* Location */}
              <div className='flex items-center gap-1 my-2'>
                <FaLocationDot className='fill-green-600' size={15} />
                <h1 className='text-gray-600 font-semibold text-sm truncate'>
                  {listingData.address}
                </h1>
              </div>
              {/* Description */}
              <div>
                <span className='font-semibold text-lg'>Description -</span>
                {listingData.description}
              </div>
              {/* type */}
              <div className='my-2'>
                <button className='font-semibold bg-red-700 text-white rounded-md py-0.5 px-16 sm:px-20'>
                  {listingData.type === "rent" ? "For Rent" : "For Sale"}
                </button>
                {/* <button>
                {listingData?.offer&&(
                  <p>
                  ${listingData.regularPrice- +listingData.discountedPrice} discount
                  </p>
                )}
              </button> */}
              </div>
              {/* Beds,Bath,Parking Spot,Furnished */}
              <div className='flex flex-wrap gap-2 font-semibold sm:gap-5'>
                <div className='flex items-center gap-0.5'>
                  <FaBed />
                  {listingData.bedrooms > 1
                    ? `${listingData.bedrooms}Bed`
                    : "1 Bed"}
                </div>
                <div className='flex items-center gap-0.5'>
                  <FaBath />
                  {listingData.bathrooms > 1
                    ? `${listingData.bathrooms}Baths`
                    : "1 Bath"}
                </div>
                <div className='flex items-center gap-0.5'>
                  <FaParking />
                  {listingData.parking ? "Parking" : "Not Parking"}
                </div>
                <div className='flex items-center gap-0.5'>
                  <FaChair />
                  {listingData.furnished ? "Furnished" : "Not Furnished"}
                </div>
              </div>
              <div className='mt-3'>
                {contactLandlord && (
                  <form action=''>
                    <div className='mb-3'>
                      <label htmlFor='massage'>
                        Any questions or feedback? send a message
                      </label>
                      <textarea
                        onChange={(e) => {
                          console.log(e.target.value);
                        }}
                        rows='2.5'
                        cols='25'
                        className='mt-2 text-xl w-full border-2 p-2 rounded-md focus:border-blue-800 focus:outline-none'
                        type='text'
                        // value={formData.address}
                        placeholder='Massage'
                      />
                    </div>
                  </form>
                )}
                <button
                  onClick={() => {
                    setContactLandlord(true);
                    setTimeout(() => {
                      setContactLandlord(false);
                    }, 10000);
                  }}
                  className=' focus:outline-none bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase w-full py-2 rounded-md'
                >
                  {contactLandlord ? "Send massage" : "contact Landlord"}
                </button>
              </div>
            </div>
            <div className='w-full h-[50vh] sm:h-auto sm:w-[50%] mt-5 sm:mt-0 px-5 py-6'>
              {/* <h1>second div</h1> */}
              {listingData?.geoLocation && (
                <div className='w-[100%] h-[100%] rounded-md'>
                  <MapContainer
                    center={[
                      listingData?.geoLocation?.lat &&
                        listingData.geoLocation.lat,

                      listingData?.geoLocation?.lng &&
                        listingData.geoLocation.lng,
                    ]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    <Marker
                      position={[
                        listingData?.geoLocation?.lat &&
                          listingData.geoLocation.lat,
                        listingData?.geoLocation?.lng &&
                          listingData.geoLocation.lng,
                      ]}
                    >
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
