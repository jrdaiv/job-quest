import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import JobTracking from "./components/JobTracking";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import AuthenticationGaurd from "./components/AuthenticationGaurd";
import MyQuests from "./components/MyQuests";

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        {/* <NavigationBar /> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/myquests" element={<MyQuests />} />

          {/* Protected Routes */}
          <Route element={<AuthenticationGaurd />}>
            {" "}
            {/* This will protect all routes nested within */}
            <Route path="/home" element={<Home />} />
            <Route path="/job-tracking" element={<JobTracking />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
