import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Nav from "./Nav";
import Profile from "../routes/Profile";

const AppRouter = ({ isLoggedIn }) => {
  return (
    <>
      {isLoggedIn && <Nav />}
      <Routes>
        {
          isLoggedIn ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </> //참
          ) : (
            <Route path="/" element={<Auth />} />
          ) //거짓
        }
      </Routes>
    </>
  );
};

export default AppRouter;
