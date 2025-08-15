import React, { useState } from "react";
import JobquestLogo from "../assets/LogoDefault.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>('');  // Full Name state
  const [email, setEmail] = useState<string>('');  // Email state
  const [password, setPassword] = useState<string>('');  // Password state
  const [error, setError] = useState<string>('');  // Error state
  const [isHovered, setIsHovered] = useState<boolean>(false);  // Hover state for sign up button
  const navigate = useNavigate();

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default form submission behavior
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        name: name,
        email: email,
        password: password,
      });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('access_token', response.data.token);
      console.log(localStorage.getItem('access_token'));
      console.log("User created:", response.data);
      navigate('/myquests');
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create user. User already exists.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center">
        {/* Logo */}
        <div className="w-full flex justify-start float-left p-8">
          <a href="/">
            <img src={JobquestLogo} alt="Jobquest Logo" className="w-[200px] h-auto" /></a>
        </div>

        {/* Sign Up Form */}
        <div className="rounded-lg p-10 w-[544px] text-center">
          <h1 className="text-[40px] font-bold mb-4">Create your Job Quest Account</h1>
          <p className="text-gray-600 mb-6">Finding a job is boring. Our platform makes it fun.</p>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="flex text-sm font-normal pl-[15px] mb-[8px]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}  // Update email state
              className="w-full px-4 h-[51px] border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Full Name Input */}
          <div className="mb-4">
            <label htmlFor="email" className="flex text-sm font-normal pl-[15px] mb-[8px] mt-6">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}  // Update name state
              className="w-full h-[51px] px-4 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="email" className="flex text-sm font-normal pl-[15px] mb-[8px] mt-6">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}  // Update password state
              className="w-full px-4 h-[51px] border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Create Account Button */}
          <button
            style={{
              backgroundColor: email && password && name
                ? isHovered ? '#087EFF5C' : '#087EFF' // Change color on hover
                : 'gray',
              color: 'white',
              cursor: email && password && name ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s ease', // Smooth transition effect
            }}
            onClick={createUser}
            className="text-white py-[18px] px-7 rounded-[15px] h-[60px] font-semibold mt-[40px]"
            disabled={!email || !password || !name} // Disable button if inputs are empty
            onMouseEnter={() => setIsHovered(true)} // Set hover state to true
            onMouseLeave={() => setIsHovered(false)} // Set hover state to false
          >
            Create Account
          </button>

          {/* Error Message */}
          {error && <p className="text-red-600 mt-5">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default SignUp;
