import { getAuth, updateProfile } from "firebase/auth";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../../Firebase/Firebase";
import { Link } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import LoadingIcon from "../../Components/UI/LoadingIcon";
import ListingItem from "../../Components/UI/ListingItem";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [FormData, setFormData] = React.useState({
    name: "",
    email: "",
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [listingData, setListingData] = useState([]);

  async function changeDetail() {
    try {
      if (auth.currentUser.displayName !== FormData.name.length) {
        // update display name in firestore and auth
        await updateProfile(auth.currentUser, {
          displayName: FormData.name,
        });
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name: FormData.name,
        });
        toast.success("Profile updated");
        window.location.reload();
      }
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    }
  }

  useEffect(() => {
    setLoading(true);
    async function getUserListingData() {
      try {
        if (auth.currentUser.uid) {
          if (collection) {
            const querySnapshot = await getDocs(collection(db, "listings"));
            const listings = [];
            querySnapshot.forEach((doc) => {
              if (doc.data().userRef === auth.currentUser.uid) {
                return listings.push({
                  id: doc.id,
                  data: doc.data(),
                });
              }
            });
            setListingData(listings);
            setLoading(false);
          }
        }
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    }
    getUserListingData();
  }, [auth.currentUser.uid]);

  return (
    <>
      {/* popup box */}
      <div>
        {isOpen && (
          <div className='bg-black/70 fixed z-30 bg-opacity-10 flex h-screen w-full justify-center items-center'>
            <div className='bg-white max-w-sm md:w-1/3 sm:w-1/2 mx-2 sm:mx-0 rounded-sm p-5'>
              <div className='py-3'>
                <input
                  type='text'
                  placeholder='Name'
                  onChange={(e) => {
                    setFormData({ ...FormData, name: e.target.value });
                  }}
                  className='w-full focus:outline-none border-2 focus:border-blue-500 rounded-sm text-lg p-2'
                />
              </div>
              <div className='flex justify-between'>
                <div>
                  <button
                    className='bg-green-500 hover:bg-green-600 px-3 py-2 rounded-sm font-semibold text-black/70 hover:text-black/90'
                    onClick={() => {
                      changeDetail();
                      setIsOpen(false);
                    }}
                  >
                    Change
                  </button>
                </div>
                <div>
                  <button
                    className='bg-red-500 hover:bg-red-600 px-3 py-2 rounded-sm font-semibold text-black/70 hover:text-black/90'
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* profile card */}
      <div>
        <h1 className='text-center font-bold text-3xl sm:text-4xl my-5 sm:my-8'>
          My Profile
        </h1>
      </div>
      <div className='flex justify-center items-center mt-10'>
        <div className='mx-3 w-72 sm:w-1/3 lg:w-1/5 text-center rounded-sm relative border-2'>
          <div className='absolute -top-[30%] left-[40%]'>
            <CgProfile className='text-black/50 rounded-full' size={60} />
          </div>
          <div className='my-7'>
            <h1 className='font-bold py-1'>{auth.currentUser?.displayName}</h1>
            <h2 className='font-bold py-1'>{auth.currentUser?.email}</h2>
          </div>
        </div>
      </div>
      <div className='flex gap-5 items-center justify-center mx-3 my-3 text-sm'>
        <div className=''>
          Do you what to change your name?
          <span
            onClick={() => {
              setIsOpen(true);
            }}
            className='text-red-500 cursor-pointer font-semibold'
          >
            Edit
          </span>
        </div>
        <div
          onClick={() => {
            auth.signOut();
            navigate("/");
            toast.success("Logged out successfully");
          }}
          className='text-blue-500 cursor-pointer font-semibold'
        >
          Sign out
        </div>
      </div>
      {/*   Sell or rent your home button */}
      <div className='flex justify-center py-3'>
        <div className='mx-3 w-72 sm:w-1/3 lg:w-1/5'>
          <button
            className='bg-blue-500 font-medium text-white w-full rounded-sm p-2'
            onClick={() => {
              navigate("/create-listing");
            }}
          >
            <Link
              to='/create-listing'
              className='flex justify-center items-center gap-1 uppercase'
            >
              <FcHome
                size={25}
                className=' bg-red-300 rounded-full p-0.5 border-2'
              />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </div>
      {/* Loading */}
      <div>{loading && <LoadingIcon />}</div>
      <div className='px-2 sm:px-5 lg:px-52'>
        {!loading && listingData.length > 0 && (
          <div>
            <h1 className='text-center font-semibold text-3xl sm:text-4xl my-5 sm:my-8'>
              My listing
            </h1>
          </div>
        )}
        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3'>
          {listingData.map((listing) => {
            return (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Profile;
