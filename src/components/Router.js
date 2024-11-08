import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = () => {
  const [isLoggidIn, setIsLoggidIn] = useState(false);
  return (
    <Routes>
      {isLoggidIn ? (
        <Route path="/" element={<Home />} /> //참
      ) : (
        <Route path="/" element={<Auth />} /> //거짓
      )}
    </Routes>
  );
};

export default AppRouter;
