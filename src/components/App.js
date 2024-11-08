import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { authService } from "../firebase";
import AppRouter from "./Router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

console.log(authService);

function App() {
  const [isLoggedIn, setIsLoggidIn] = useState(false);
  const [init, setInit] = useState(false); //로그인 여부 확인 시작 여부

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //유저정보가 있다면
        setIsLoggidIn(true);
      } else {
        setIsLoggidIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>{init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing...."}</>
  );
}

export default App;
