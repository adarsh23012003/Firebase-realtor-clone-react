import React, { useState } from "react";
import LoadingIcon from "../Components/UI/LoadingIcon";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { db } from "../../src/Firebase/Firebase";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";

function CreateListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [getLocationEnable, setGetLocationEnable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imagesUrls, setImagesUrls] = useState([]);
  const [formData, setFormData] = React.useState({
    type: "",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    offer: false,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    offer,
  } = formData;
  async function handelSubmit() {
    setLoading(true);

    if (formData.discountedPrice >= formData.regularPrice) {
      toast.error("Discounted price needs to be less than regular price");
      setLoading(false);
      return;
    }
    if (imagesUrls.length >= 6) {
      setLoading(false);
      toast.error("maximum 6 images are allowed");
      return;
    }
    let geoLocation = {};
    let location;
    if (getLocationEnable) {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.address.trim()}&key=AIzaSyBdYVEZEBkDRm240spjdgBW12CyW5S1yuE`
      );
      const data = await res.json();
      // console.log(data);
      geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location = data.status;

      if (location === "ZERO_RESULTS") {
        setLoading(false);
        toast.error("Enter a valid address or location");
        return;
      } else {
        setLoading(false);
        geoLocation.lat = latitude;
        geoLocation.lng = longitude;
      }
      // Image uploading function
      async function storeImage(oneImage) {
        setLoading(true);
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const filename = `${auth.currentUser.uid}-${
            oneImage.name
          }-${uuidv4()}`;
          // Upload file and metadata to the object 'images/mountains.jpg'
          const storageRef = ref(storage, filename);
          const uploadTask = uploadBytesResumable(storageRef, oneImage);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
                // console.log("File available at", downloadURL);
              });
            }
          );
        });
      }
      const imgUrls = await Promise.all(
        [...imagesUrls].map((image) => storeImage(image))
      ).catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error("Could not upload images");
        return;
      });

      const formDataCopy = {
        ...formData,
        imgUrls,
        geoLocation,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };
      delete formDataCopy.images;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;
      const docRef = await addDoc(collection(db, "listings"), formDataCopy);
      toast.success("Listing created successfully");
      setLoading(false);
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }
  }

  return (
    <>
      {/* Loading */}
      <div>{loading && <LoadingIcon />}</div>
      <div>
        <h1 className='text-center font-semibold text-3xl sm:text-4xl my-5 sm:my-8'>
          Create a listing
        </h1>
      </div>
      <div className='flex justify-center items-center'>
        <div className='mx-3 w-full sm:w-1/3 lg:w-1/4 text-center text-sm sm:text-lg'>
          {/* Sell and Rent */}
          <div className='text-start my-5 sm:my-6'>
            <label className='font-bold sm:font-semibold' htmlFor=''>
              Sell / Rent
            </label>
            <div className='flex gap-10'>
              <div className='w-[50%] text-center'>
                <button
                  onClick={() => {
                    setFormData({ ...formData, type: "sell" });
                  }}
                  className={`font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-75 ease-in-out w-full rounded-sm py-2 ${
                    type === "sell" ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  Sell
                </button>
              </div>
              <div className='w-[50%] text-center'>
                <button
                  onClick={() => {
                    setFormData({ ...formData, type: "rent" });
                  }}
                  className={`font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-75 ease-in-out w-full rounded-sm py-2 ${
                    type === "rent" ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>
          </div>
          {/* Name */}
          <div className='text-start my-5 sm:my-6'>
            <label className='font-bold sm:font-semibold' htmlFor='Name'>
              Name
            </label>
            <div>
              <input
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                className='focus:outline-none border-2 hover:border-blue-500 rounded-sm p-1.5 w-full'
                value={name}
                required
                type='text'
                placeholder='Name'
              />
            </div>
          </div>
          {/* Beds and baths */}
          <div className='text-start my-5 sm:my-6'>
            <div className='flex gap-10'>
              <div>
                <label className='font-bold sm:font-semibold' htmlFor=''>
                  Beds
                </label>
                <div>
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, bedrooms: e.target.value });
                    }}
                    required
                    value={bedrooms}
                    min='1'
                    type='number'
                    name='bedrooms'
                    id=''
                    className='focus:outline-none border-2 hover:border-blue-500 rounded-sm p-1.5 text-center w-24'
                  />
                </div>
              </div>
              <div>
                <label className='font-bold sm:font-semibold' htmlFor=''>
                  Baths
                </label>
                <div>
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, bathrooms: e.target.value });
                    }}
                    required
                    min='1'
                    value={bathrooms}
                    type='number'
                    name='bathrooms'
                    className='focus:outline-none border-2 hover:border-blue-500 rounded-sm p-1.5 text-center w-24'
                  />
                </div>
              </div>
            </div>
          </div>
          {/*  Parking Spot */}
          <div className='text-start my-5 sm:my-6'>
            <label className='font-bold sm:font-semibold' htmlFor=''>
              Parking Spot
            </label>
            <div className='flex gap-10'>
              <div className='w-[50%] text-center'>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      parking: true,
                    });
                  }}
                  className={`font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-75 ease-in-out w-full rounded-sm py-2 ${
                    parking ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  Yes
                </button>
              </div>
              <div className='w-[50%] text-center'>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      parking: false,
                    });
                  }}
                  className={`font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-75 ease-in-out w-full rounded-sm py-2 ${
                    !parking ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          {/* Furnished */}
          <div className='text-start my-5 sm:my-6'>
            <label className='font-bold sm:font-semibold' htmlFor=''>
              Furnished
            </label>
            <div className='flex gap-10'>
              <div className='w-[50%] text-center'>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      furnished: true,
                    });
                  }}
                  className={`font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-75 ease-in-out w-full rounded-sm py-2 ${
                    furnished ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  Yes
                </button>
              </div>
              <div className='w-[50%] text-center'>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      furnished: false,
                    });
                  }}
                  className={`font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-75 ease-in-out w-full rounded-sm py-2 ${
                    !furnished ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          {/* Address */}
          <div className='text-start my-5 sm:my-6'>
            <label className='font-bold sm:font-semibold' htmlFor='Name'>
              Address
            </label>
            <div>
              <textarea
                value={address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                }}
                rows='3'
                cols='25'
                className='w-full border-2 p-2 rounded-sm focus:border-blue-500 focus:outline-none'
                type='text'
                placeholder='Address'
              />
            </div>
          </div>
          {/* latitude and longitude */}
          {getLocationEnable && (
            <div className='text-start my-5 sm:my-6'>
              <div className='flex gap-10'>
                <div className='w-full'>
                  <label className='font-bold sm:font-semibold' htmlFor=''>
                    latitude
                  </label>
                  <div>
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, latitude: e.target.value });
                      }}
                      required
                      value={latitude}
                      min='-90'
                      max='90'
                      type='number'
                      name='latitude'
                      className='focus:outline-none border-2 hover:border-blue-500 rounded-sm p-1.5 text-center w-full'
                    />
                  </div>
                </div>
                <div className='w-full'>
                  <label className='font-bold sm:font-semibold' htmlFor=''>
                    longitude
                  </label>
                  <div>
                    <input
                      onChange={(e) => {
                        setFormData({ ...formData, longitude: e.target.value });
                      }}
                      required
                      min='-180'
                      max='180'
                      value={longitude}
                      type='number'
                      name='longitude'
                      className='focus:outline-none border-2 hover:border-blue-500 rounded-sm p-1.5 text-center w-full'
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Description */}
          <div className='text-start my-5 sm:my-6'>
            <label className='font-bold sm:font-semibold' htmlFor='Name'>
              Description
            </label>
            <div>
              <textarea
                value={description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                }}
                rows='3'
                cols='25'
                className='w-full border-2 p-2 rounded-sm focus:border-blue-500 focus:outline-none'
                type='text'
                placeholder='Description'
              />
            </div>
          </div>
          {/* Offer */}
          <div className='text-start my-5 sm:my-6'>
            <label className='font-bold sm:font-semibold' htmlFor=''>
              Offer
            </label>
            <div className='flex gap-10'>
              <div className='w-[50%] text-center'>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      offer: true,
                    });
                  }}
                  className={`font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-75 ease-in-out w-full rounded-sm py-2 ${
                    offer ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  Yes
                </button>
              </div>
              <div className='w-[50%] text-center'>
                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      offer: false,
                    });
                  }}
                  className={`font-semibold uppercase shadow-sm hover:shadow-md transition-all duration-75 ease-in-out w-full rounded-sm py-2 ${
                    !offer ? "bg-gray-500 text-white" : "bg-white"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          {/* Regular Price */}
          <div className='text-start my-5 sm:my-6'>
            <label className='font-bold sm:font-semibold' htmlFor='Name'>
              Regular Price
            </label>
            <div className='flex gap-10'>
              <div className='w-[50%]'>
                <input
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      regularPrice: e.target.value,
                    });
                  }}
                  className='w-full text-center p-1.5 border-2 rounded-sm focus:border-blue-500 focus:outline-none'
                  required
                  type='number'
                  placeholder='Price'
                  value={regularPrice}
                  min='50'
                  max='4000000'
                />
              </div>
              <div className='w-[50%] font-semibold'>$ / Month</div>
            </div>
          </div>
          {/*  Discount Price */}
          {offer && (
            <>
              <div className='text-start my-5 sm:my-6'>
                <label className='font-bold sm:font-semibold' htmlFor='Name'>
                  Discount Price
                </label>
                <div>
                  <input
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        discountedPrice: e.target.value,
                      });
                    }}
                    className='w-1/2 text-center p-1.5 border-2 rounded-sm focus:border-blue-500 focus:outline-none'
                    required
                    min='50'
                    max='4000000'
                    type='number'
                    placeholder='Price'
                    value={discountedPrice}
                  />
                </div>
              </div>
            </>
          )}
          {/* Images */}
          <div className='text-start my-5 sm:my-6'>
            <p className='font-bold sm:font-semibold'>Images</p>
            <p className='text-black/50 text-sm font-semibold'>
              The first image will be the cover (max 6)
            </p>
            <div className='bg-white p-1 border-2 rounded-sm'>
              <input
                required
                accept='.jpg, .jpeg, .png'
                type='file'
                title='Image'
                multiple
                onChange={(e) => {
                  for (let i = 0; i < e.target.files.length; i++) {
                    setImagesUrls((prev) => [...prev, e.target.files[i]]);
                  }
                }}
              />
            </div>
          </div>
          <div className='my-5'>
            <button
              onClick={(e) => {
                if (
                  imagesUrls.length ||
                  name.length ||
                  description.length ||
                  address.length
                ) {
                  e.preventDefault();
                  handelSubmit();
                } else {
                  toast.error("Please fill the form");
                }
              }}
              className='uppercase w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-sm'
            >
              Create Listing
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateListing;
