import React, { useEffect, useState } from 'react';
import firstIcon from '../assets/Icons/Steps Icon.svg';
import secondIcon from '../assets/Icons/Magnify Icon.svg';
import thirdIcon from '../assets/Icons/Folder Icon.svg';
import fourthIcon from '../assets/Icons/Document Icon.svg';
import fifthIcon from '../assets/Icons/Pie Chart Icon.svg';
import sixthIcon from '../assets/Icons/Calendar Icon.svg';
import NavigationBar from './NavigationBar';
import jobQuestLogo2 from '../assets/LogoWhite.svg';
import logoHover from '../assets/LogoHover.svg';
import questImage from '../assets/Quests Image.svg';
import jobFollowUpBoardImg from '../assets/Follow-Up Board Image.svg';

const LandingPage: React.FC = () => {
  const [logoSrc, setLogoSrc] = useState(jobQuestLogo2);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setLogoSrc(logoHover);
  };

  const handleMouseLeave = () => {
    setLogoSrc(jobQuestLogo2);
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="LandingPage w-full min-h-screen bg-white relative">
        {/* Hero Section */}
        <div className="HeroSection w-full h-[618px] bg-custom-image bg-cover from-pink-300 via-purple-300 to-blue-300 relative flex flex-col items-center justify-center text-center p-4 md:flex-row">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
              Get Unstuck in Your<br /> Job Search
            </h1>
            <p className="text-lg md:text-2xl text-black mt-4">
              Say goodbye to job search overwhelm, step by step.
            </p>
            <div className="mt-6 md:mt-11">
              <a href="./signup" className="bg-[#ff2d55] hover:bg-red-400 text-white py-3 px-5 md:py-[18px] md:px-7 rounded-[15px]">
                Get Started for Free
              </a>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div id="benefits" className="BenefitsSection py-12 md:py-16 px-4">
          <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-900 mb-8 md:mb-12">The Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Benefit Card */}
            <div className="BenefitCard bg-white p-6 flex rounded-lg">
              <img src={firstIcon} className="w-10 h-10 mr-3" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Clear and Actionable Steps</h3>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  Follow structured, step-by-step instructions to stay on track.
                </p>
              </div>
            </div>

            {/* Other Benefit Cards */}
            <div className="BenefitCard bg-white p-6 flex rounded-lg">
              <img src={secondIcon} className="w-10 h-10 mr-3" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Personalized Job Search Focus</h3>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  Prioritize high-interest jobs and focus your efforts strategically.
                </p>
              </div>
            </div>

            <div className="BenefitCard bg-white p-6 flex rounded-lg">
              <img src={thirdIcon} className="w-10 h-10 mr-3" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Tracking & Follow-Ups</h3>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  Organize applications and be reminded who to follow up with.
                </p>
              </div>
            </div>

            <div className="BenefitCard bg-white p-6 flex rounded-lg">
              <img src={fourthIcon} className="w-10 h-10 mr-3" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Revamp Your Resume</h3>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  Tailor your resume for each job and optimize your LinkedIn.
                </p>
              </div>
            </div>

            <div className="BenefitCard bg-white p-6 flex rounded-lg">
              <img src={fifthIcon} className="w-10 h-10 mr-3" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Reduce Overwhelm</h3>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  Break down job search tasks into manageable actions.
                </p>
              </div>
            </div>

            <div className="BenefitCard bg-white p-6 flex rounded-lg">
              <img src={sixthIcon} className="w-10 h-10 mr-3" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Build Daily Job Search Habits</h3>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  Stay accountable and guided to long-term results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="OurFeaturesSection py-12 md:py-16 px-4">
          <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-900 mb-8 md:mb-12">Our Features</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Feature Block */}
            <img src={questImage} className="w-full object-cover" />
            <div className="flex flex-col justify-center">
              <h3 className="text-lg md:text-2xl font-semibold text-gray-900">
                Unlock step-by-step Quests to stay on track and get hired faster
              </h3>
              <p className="text-gray-700 mt-4 text-sm md:text-base">
                Welcome to My Quests—your step-by-step job search guide. Complete missions, unlock new quests, and stay organized as you progress toward landing your dream job.
              </p>
            </div>

            {/* Second Feature Block */}
            <div className="flex flex-col justify-center">
              <h3 className="text-lg md:text-2xl font-semibold text-gray-900">
                Prioritize Your Efforts with the Job Follow-Up Board
              </h3>
              <p className="text-gray-700 mt-4 text-sm md:text-base">
                Our Job Follow-Up Board helps you stay on top of your applications. See what actions need attention, prioritize high-interest roles, and get email reminders for follow-ups.
              </p>
            </div>
            <img src={jobFollowUpBoardImg} className="w-full object-cover" />
          </div>
        </div>

        {/* Footer Section */}
        <div className="FooterSection w-full h-auto bg-[#1E1E1E] border-t border-gray-700 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 text-white">
          {/* Logo */}
          <div className="JobquestLogo">
            <img
              src={logoSrc}
              alt="JobQuest Logo"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="w-[150px] h-auto md:w-[200px] cursor-pointer"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex justify-center mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row gap-4 md:gap-20 text-center">
              {isAuthenticated ? (
                <>
                  <a href="#" className="text-base md:text-xl font-normal text-white hover:text-gray-400">Our Features</a>
                  <a href="#" className="text-base md:text-xl font-normal text-white hover:text-gray-400">Resume Builder</a>
                  <a href="#" className="text-base md:text-xl font-normal text-white hover:text-gray-400">Networking Coach</a>
                </>
              ) : (
                <>
                  <a href="/signup" className="text-base md:text-xl font-normal text-white hover:text-gray-400">Sign Up</a>
                  <a href="/login" className="text-base md:text-xl font-normal text-white hover:text-gray-400">Log In</a>
                  <a href="#" className="text-base md:text-xl font-normal text-white hover:text-gray-400">Our Features</a>
                  <a href="#" className="text-base md:text-xl font-normal text-white hover:text-gray-400">Resume Builder</a>
                  <a href="#" className="text-base md:text-xl font-normal text-white hover:text-gray-400">Networking Coach</a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
