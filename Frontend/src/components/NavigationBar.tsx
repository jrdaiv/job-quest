import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/LogoDefault.svg';
import logoHover from '../assets/LogoHover.svg';

const NavigationBar: React.FC = () => {

    const [logoSrc, setLogoSrc] = useState(logo);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('access_token'); // Check JWT token
    });

    const handleMouseEnter = () => {
        setLogoSrc(logoHover);
    };

    const handleMouseLeave = () => {
        setLogoSrc(logo);
    };

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLogout = () => {
        // Remove authentication data
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('user');
        setIsAuthenticated(false); // Set state to false

        // Redirect to the landing page or login page
        navigate('/');
    };

    useEffect(() => {
        // Check for token when the component is rendered (only once)
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []); // Empty dependency array ensures this runs only on mount

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className="LandingPageHeader w-full h-[130px] bg-white border-b border-gray-300 flex items-center justify-between px-8">
            {/* Logo Section */}
            <div className="JobquestLogo">
                <img
                    src={logoSrc}
                    alt="Jobquest Logo"
                    onClick={handleLogoClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="w-[264px] h-[51px] cursor-pointer transition duration-300"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-24">
                {isAuthenticated ? (
                    <>
                        <a href='/myquests' className="text-black font-medium hover:opacity-[.36] px-14">
                            My Quests
                        </a>
                        <a href='/job-tracking' className="text-black font-medium hover:opacity-[.36] px-14">
                            My Follow-Up Board
                        </a>
                        <button onClick={handleLogout} className="text-black font-bold hover:opacity-[.36] px-14">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <a href="#benefits" className="text-base hover:opacity-[.36] font-normal">Benefits</a>
                        <a href="#features" className="text-base hover:opacity-[.36] font-normal">Features</a>
                        <button onClick={handleLogin} className="bg-white hover:opacity-[.36] border-2 border-[#087eff] text-[#087eff] rounded-[15px] py-[18px] px-7 font-bold">
                            Login
                        </button>
                        <button onClick={handleSignup} className="bg-[#ff2d55] hover:bg-red-400 text-white rounded-[15px] py-[18px] px-7 font-semibold">
                            Get Started for Free
                        </button>
                    </>
                )}
            </div>

            {/* Mobile Menu Button (Hamburger Icon) */}
            <div className="lg:hidden">
                <button onClick={toggleMenu} className="text-black focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Off-Canvas Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-[250px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <button onClick={toggleMenu} className="absolute top-4 right-4 text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div className="flex flex-col items-start mt-20 ml-6">
                    {isAuthenticated ? (
                        <>
                            <a href='/myquests' className="mb-4 text-black font-medium">My Quests</a>
                            <a href='/job-tracking' className="mb-4 text-black font-medium">My Follow-Up Board</a>
                            <button onClick={handleLogout} className="text-black font-bold mb-4">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="#benefits" className="mb-4 text-base text-black">Benefits</a>
                            <a href="#features" className="mb-4 text-base text-black">Features</a>
                            <button onClick={handleLogin} className="bg-white border-2 border-[#087eff] text-[#087eff] rounded-[15px] py-[10px] px-5 mb-4">
                                Login
                            </button>
                            <button onClick={handleSignup} className="bg-[#ff2d55] text-white rounded-[15px] py-[10px] px-5">
                                Get Started for Free
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* White Overlay when off-canvas menu is open */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-white opacity-100 z-40"
                    onClick={toggleMenu} // Close the menu when the overlay is clicked
                ></div>
            )}
        </div>
    );
};


export default NavigationBar;
