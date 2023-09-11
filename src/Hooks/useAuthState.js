import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";

export function useAuthState() {
  const [isLogin, setIsLogin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
      setIsLoading(false);
    });
  });
  return { isLogin, isLoading };
}
