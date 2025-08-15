import { Button } from "@material-tailwind/react";
import "inter-ui";
import pageInfoIllustration from "../assets/Page Info Illustration-02.svg";
import pageFooterIllustration from "../assets/Quest Page Footer Illustration-03.svg"

const Instructions: React.FC = () => {

  const handleButtonClick = () => {
    window.location.href = "/myquests";
    console.log("Button clicked!");
  };


  return (
    <>
      <div className='bg-no-repeat'>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-no-repeat"
        // style={{ backgroundImage: `url(${heroLogo})`, backgroundPositionY: '-400px' }}
        >
          {/* <img src={heroLogo} className="" /> */}
            {/* <div className="absolute inset-0 bg-no-repeat opacity-40 bg-custom-image-2 " /> */}
          <div className="relative w-full flex flex-col items-center mt-16 ">
            <div className="container justify-center flex flex-wrap items-center mb-16">
              {/* First Text Block */}
              <div className="flex flex-col lg:flex-row justify-center items-center text-center lg:text-left lg:space-x-20">
                <div className="w-full lg:w-[438px] mb-8 lg:mb-0">
                  <p className="leading-7 lg:leading-[28.80px] text-xl lg:text-2xl font-bold mb-4">
                    Finding your first job or transitioning into a new role can be
                    overwhelming. Where do you start? What should you focus on?
                  </p>
                  <p className="text-base lg:text-lg leading-relaxed text-gray-800">
                    It’s easy to feel stuck and unsure of what to do next. That’s
                    why we created Job Quest—a guided, step-by-step approach that
                    turns your job search into a series of bite-sized, actionable
                    Quests to help you make consistent progress toward landing
                    interviews and job offers.
                  </p>
                </div>
                <img className="w-[300px] lg:w-auto h-auto" src={pageInfoIllustration} alt="Page Info Illustration" />
              </div>
            </div>

            {/* Large Centered Text */}
            <p className="text-center w-full lg:w-[824px] text-2xl lg:text-[32px] leading-6 lg:leading-[44.80px] text-gray-800 mb-16 lg:mb-[80px] px-4">
              Each Quest is designed to take you closer to your goal, breaking down
              the daunting process into small, achievable missions that are simple
              to follow, motivating, and structured to get you results.
            </p>

            {/* "What Are My Quests?" Section */}
            <h2 className="text-[32px] lg:text-[40px] font-semibold text-gray-800 text-center mb-12 lg:mb-[61px]">
              What Are My Quests?
            </h2>

            {/* Bullet Point Text Section */}
            <div className="w-full lg:w-[824px] text-lg lg:text-xl leading-normal text-gray-700 mb-16 lg:mb-[89px] px-4">
              <p>
                Job hunting can be discouraging, but Job Quest turns it into a
                motivating adventure. With each Quest you unlock and complete,
                you’ll:
              </p>
              <br />
              <ul className="list-disc space-y-4 lg:space-y-8 ml-4 lg:ml-8">
                <li>
                  Eliminate the Guesswork: Never wonder what to do next. Every Quest
                  gives you a clear action plan and step-by-step instructions.
                </li>
                <li>
                  Stay Organized and On Track: Avoid feeling scattered or
                  overwhelmed. Quests keep your focus on the right tasks at the
                  right time.
                </li>
                <li>
                  Build Momentum and Confidence: Celebrate small wins along the way
                  as you complete Missions and watch your progress unfold.
                </li>
                <li>
                  Reduce Procrastination: Our guided structure and motivating
                  reminders make it easier to stay consistent and avoid getting
                  stuck.
                </li>
                <li>
                  Feel Supported: You’re not alone! Each Quest is designed to help
                  you succeed, with our friendly mascot cheering you on at every
                  step.
                </li>
              </ul>
            </div>

            {/* Start Quest Button */}
            <div className="flex items-center justify-center mt-8 lg:mt-[109px] mb-16 lg:mb-48">
              <Button
                className="bg-[#ff2d55] cursor-pointer h-[50px] lg:h-[60px] text-white font-bold px-5 lg:px-7 py-3 lg:py-[18px] rounded-[15px] hover:bg-[#FF95AF] z-50"
                onClick={handleButtonClick}>
                Start Quest
              </Button>
            </div>

            <img src={pageFooterIllustration} className="" alt="Page Footer Illustration" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Instructions;
