import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../../Firebase/Firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

function GoogleAuth() {
  async function signInWithGoogle() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      //   Check for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          //   photoUrl: user.photoURL,
          timestamp: serverTimestamp(),
        });
        toast.success("Account created successfully");
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      //   console.log(user);
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    }
  }
  return (
    <>
      <div>
        <button
          onClick={() => signInWithGoogle()}
          className='flex gap-2 justify-center items-center text-center uppercase w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2.5 px-6 rounded-sm'
        >
          <div className='bg-white rounded-full p-0.5'>
            <FcGoogle size={25} />
          </div>
          <h1>Continue With Google</h1>
        </button>
      </div>
    </>
  );
}

export default GoogleAuth;
