import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import LoadingIcon from "../Components/UI/LoadingIcon";
import Carousel from "../Components/UI/Carousel";

export default function Listing() {
  const [listingData, setListingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const param = useParams();
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
  // console.log(listingData.imgUrls);
  return (
    <>
      {/* Loading */}
      <div>{loading && <LoadingIcon />}</div>
      <div>
        <Carousel data={listingData.imgUrls} />
        <div className='px-2 sm:px-5 lg:px-52'>
          <h1>Listing</h1>
        </div>
      </div>
    </>
  );
}
