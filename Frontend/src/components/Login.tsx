import React, { useEffect, useState } from "react";
import JobquestLogo from "../assets/LogoDefault.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // Email state
  const [password, setPassword] = useState<string>(''); // Password state
  const navigate = useNavigate(); // React Router's navigate for redirection
  const [isHovered, setIsHovered] = useState<boolean>(false); // Hover state
  const [error, setError] = useState<string>('');

  const fetchUserLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: email,
        password: password,
      });

      localStorage.setItem('access_token', response.data.access_token); // Store JWT (access_token) in local storage
      navigate('/myquests'); // Redirect to home page after successful login
      console.log(localStorage.getItem('access_token'));
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid email or password');
    }
  };

  useEffect(() => {
    // Redirect if the user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/myquests');
    }
  }, [navigate]);

  const handleDemoLogin = () => {
    setEmail('testing@test.com');
    setPassword('password');
  };

  return (
    <div className="flex flex-wrap items-center justify-center">
      {/* Logo */}
      <div className="w-full flex justify-start float-left  p-8">
        <a href="/">
          <img src={JobquestLogo} alt="Jobquest Logo" className="w-[200px] h-auto" />
        </a>
      </div>

      {/* Login Form */}
      <div className=" p-10 w-[544px] text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-gray-600 mb-6">
          Don't have an account yet?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">Sign up now</a>
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="flex text-sm font-normal pl-[15px] mb-[8px]">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}  // Update email state
            className="w-full h-[51px] px-4 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="email" className="flex text-sm font-normal pl-[15px] mb-[8px]">
            Password
          </label>
          <input
            type="password"
            value={password}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}  // Update password state
            className="w-full h-[51px] px-4 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <a href="/forgot-password" className="text-blue-500 text-sm hover:underline">
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <button
          style={{
            backgroundColor: email && password
              ? isHovered ? '#087EFF5C' : '#087EFF' // Change color on hover
              : 'gray',
            color: 'white',
            cursor: email && password ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s ease', // Smooth transition effect
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded-[15px] w-28 h-14 font-semibold hover:bg-blue-700"
          disabled={!email || !password} // Disable button if either email or password is empty
          onMouseEnter={() => setIsHovered(true)} // Set hover state to true
          onMouseLeave={() => setIsHovered(false)} // Set hover state to false
          onClick={fetchUserLogin}
        >
          Login
        </button>

        {/* Demo Login Button */}
        <div className="mt-4">
          <button
            onClick={handleDemoLogin}
            className="py-2 px-4 rounded-lg text-blue-500"
          >
            Use Demo Account
          </button>
        </div>


        {error && <p className="text-red-600 mt-5">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
