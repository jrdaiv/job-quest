import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardFooter, Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { X } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import { hardcodedMissions, hardcodedMissions2, hardcodedMissions3, hardcodedMissions4, hardcodedMissions5, hardcodedMissions6, Mission, Quest } from './HardCodedMission';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Toaster, toast } from 'react-hot-toast'

// import lockLogo from '../assets/Icons/Lock Icon.svg';
import linkedInLogo from '../assets/LinkedIn Logo.svg';
import indeedLogo from '../assets/indeed PNG (1).svg';
import ottaLogo from '../assets/Otta PNG.svg';
import lockedLogo from '../assets/Icons/Lock Icon.svg';
import creativelyLogo from '../assets/creatively logo.svg';
import headlineLogo from '../assets/Headline Example 1.svg';
import linkedinLogo2 from '../assets/Photo and Banner LinkedIn Example 2.svg';
import arrowIcon from '../assets/Icons/Arrow Icon.svg'
import rectangleLogo from '../assets/Rectangle 699 (1).svg'

interface QuestsProps {
    onQuestsClick: () => void;  // Define the type for the onQuestsClick prop
}

const QuestPage: React.FC<QuestsProps> = ({ onQuestsClick }) => {
    const userId = localStorage.getItem('access_token') || '';

    const [quests, setQuests] = useState<Quest[]>(() => {
        const savedQuests = JSON.parse(localStorage.getItem(`${userId}_completedQuests`) || '[]');
        return savedQuests; // Initialize with saved quests if available
    });
    const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
    const [completedMissions, setCompletedMissions] = useState<Record<number, boolean[]>>(() => {
        return JSON.parse(localStorage.getItem(`${userId}_completedMissions`) || '{}');
    });
    const [open, setOpen] = useState(false);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [selectedMissionIndex, setSelectedMissionIndex] = useState<number | null>(null);
    const [isConfettiVisible, setIsConfettiVisible] = useState(false);
    const dialogBodyRef = useRef<HTMLDivElement>(null); // Ref for the dialog body
    const dialogRef = useRef<HTMLDivElement>(null);

    // const navigate = useNavigate();

    // **Load saved data from local storage when component mounts**
    useEffect(() => {
        if (!userId) {
            console.error('User ID not found. Unable to load quests.');
            return;
        }
        const savedQuests = JSON.parse(localStorage.getItem(`${userId}_completedQuests`) || '[]');
        fetchAndApplyQuests(savedQuests);
    }, [userId]);

    const fetchAndApplyQuests = async (savedQuests: number[]) => {
        try {
            const response = await axios.get('/api/quests/all');
            const updatedQuests = response.data.map((quest: Quest) => ({
                ...quest,
                completed: savedQuests.includes(quest.quest_id),
            }));
            setQuests(updatedQuests);
        } catch (error) {
            console.error('Error fetching quests:', error);
        }
    };

    // **Persist completed missions and quests to local storage**
    useEffect(() => {
        if (userId) {
            localStorage.setItem(`${userId}_completedMissions`, JSON.stringify(completedMissions));
            const completedQuestIds = Object.keys(completedMissions)
                .filter((questId) => completedMissions[parseInt(questId)].every(Boolean))
                .map(Number);

            localStorage.setItem(`${userId}_completedQuests`, JSON.stringify(completedQuestIds));
        }
    }, [completedMissions, userId]);


    const handleSelectQuest = (quest: Quest) => {
        // Use hardcoded missions for demonstration purposes
        if (quest.quest_id === 1) {
            setCurrentQuest({ ...quest, missions: hardcodedMissions });
        } else if (quest.quest_id === 2) {
            setCurrentQuest({ ...quest, missions: hardcodedMissions2 });
        } else if (quest.quest_id === 3) {
            setCurrentQuest({ ...quest, missions: hardcodedMissions3 });
        } else if (quest.quest_id === 4) {
            setCurrentQuest({ ...quest, missions: hardcodedMissions4 });
        } else if (quest.quest_id === 5) {
            setCurrentQuest({ ...quest, missions: hardcodedMissions5 });
        } else if (quest.quest_id === 6) {
            setCurrentQuest({ ...quest, missions: hardcodedMissions6 });
        } else {
            setCurrentQuest(quest); // Use the missions from the API for other quests
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };


    const handleBackToQuests = () => {
        setCurrentQuest(null);
    };

    const handleStartMission = (quest: Quest, mission: Mission) => {
        const missionIndex = mission.mission_id - 1;
        const isUnlocked = completedMissions[quest.quest_id]?.[missionIndex - 1] || missionIndex === 0;
        if (!isUnlocked) return;


        setCurrentQuest(quest);
        setSelectedMission(mission);
        setSelectedMissionIndex(missionIndex); // Set the current mission index
        setOpen(true);
        setIsNextDisabled(!completedMissions[quest.quest_id]?.[missionIndex]);
    };

    const handleFinishMission = () => {
        if (!currentQuest || !selectedMission) return;
        setCompletedMissions((prev) => {
            const updatedMissions = [...(prev[currentQuest.quest_id] || [])];
            updatedMissions[selectedMission.mission_id - 1] = true;

            const newCompletedMissions = { ...prev, [currentQuest.quest_id]: updatedMissions };
            setIsNextDisabled(!newCompletedMissions[currentQuest.quest_id]?.every(Boolean));

            // Unlock the first mission of the next quest if this is the last mission of the current quest
            if (selectedMission.mission_id === currentQuest.missions.length && newCompletedMissions[currentQuest.quest_id]?.every(Boolean)) {
                const nextQuestId = currentQuest.quest_id + 1;
                if (!newCompletedMissions[nextQuestId]) {
                    newCompletedMissions[nextQuestId] = [false];
                }
            }
            localStorage.setItem(`${userId}_completedMissions`, JSON.stringify(newCompletedMissions));
            return newCompletedMissions;
        });
        toast('Congrats, on Completing a Mission!',
            {
                icon: '🎉',
                position: 'bottom-right',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );

        const currentMissionIndex = selectedMission.mission_id - 1;
        if (currentMissionIndex + 1 < currentQuest.missions.length) {
            setSelectedMission(currentQuest.missions[currentMissionIndex + 1]);
            setSelectedMissionIndex(currentMissionIndex + 1);
        } setOpen(false)
    };

    const handleBackMission = () => {
        if (!currentQuest || selectedMissionIndex === null || selectedMissionIndex <= 0) {
            return;
        }

        // Calculate the previous mission index
        const previousMissionIndex = selectedMissionIndex - 1;
        const previousMission = currentQuest.missions[previousMissionIndex];

        // Update the selected mission and index
        setSelectedMission(previousMission);
        setSelectedMissionIndex(previousMissionIndex);

        // Keep the dialog open and force a re-render
        setOpen(false); // Temporarily close the dialog
        setTimeout(() => setOpen(true), 0); // Re-open the dialog immediately
    };

    const handleNextQuest = () => {
        if (!currentQuest) return;  // Ensure currentQuest is not null

        // Check if all missions are completed for the current quest
        const completedMissionsForQuest = completedMissions[currentQuest.quest_id] || [];

        if (completedMissionsForQuest.every(Boolean)) {
            // Show confetti when all missions are completed
            handleConfetti();
            // Delay resetting the quest until after the confetti animation
            setTimeout(() => {
                setCurrentQuest(null);
            }, 4000);  // Delay to match the confetti timeout
            localStorage.getItem(`${userId}_completedQuests`)
        } else {
            setCurrentQuest(null);
        }
    };

    const handleConfetti = () => {
        toast('Congratulations, You Completed a Quest!',
            {
                icon: '🎉',
                position: 'bottom-left',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
        setIsConfettiVisible(true);

        // Hide confetti after 2.5 seconds
        setTimeout(() => setIsConfettiVisible(false), 4000);
    };



    const { width, height } = useWindowSize()

    const isNextQuestAvailable = () => {
        if (!currentQuest) return false;

        // Check if all missions are completed for the current quest
        const totalMissions = currentQuest.missions.length;
        const completedMissionsForQuest = completedMissions[currentQuest.quest_id] || [];
        const completedCount = completedMissionsForQuest.filter(Boolean).length;

        return completedCount === totalMissions;
    };

    const hoverColors = [
        'hover:bg-[#63DBE26B]',
        'hover:bg-[#3188FF6B]',
        'hover:bg-[#6FCF976B]',
        'hover:bg-[#9747FF6B]',
        'hover:bg-[#FF95AF6B]',
        'hover:bg-[#F2C84C6B]'
    ]

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                if (dialogBodyRef.current) {
                    dialogBodyRef.current.scrollTop = 0; // Reset dialog body scroll
                }
                if (dialogRef.current) {
                    dialogRef.current.scrollTop = 0; // Ensure the whole dialog resets
                }
            }, 0); // Delay to ensure DOM has updated
        }
    }, [open]);

    return (
        <>
            <div className='bg-transparent'>

                <Toaster />
                <div className="container mx-auto mt-10 p-16 bg-transparent">
                    {currentQuest ? (
                        <>
                            <div className="mx-auto mt-16 mb-8 text-center relative bottom-5">
                                <h1 className="text-5xl font-bold">
                                    Quest {currentQuest.quest_id}: {currentQuest.title}
                                </h1>
                                <p className="mx-auto mt-5 text-2xl">
                                    Below are your missions to help you get started with discovering jobs.
                                </p>
                            </div>

                            {/* Conditionally render Instructions only for Quest 1, Mission 1 */}


                            <div className="flex flex-wrap gap-4 justify-center bg-transparent">
                                {Array.isArray(currentQuest?.missions) && currentQuest.missions.length > 0 ? (
                                    currentQuest.missions.map((mission, index) => {
                                        // Determine if the current quest is the active quest or a subsequent quest
                                        const isTrackingActiveQuest = currentQuest.quest_id === 1 || isNextQuestAvailable();

                                        // Determine if the current mission is unlocked based on completion status
                                        const isUnlocked = (isTrackingActiveQuest && (index === 0 || completedMissions[currentQuest.quest_id]?.[index - 1]))
                                            || (index === 0 && completedMissions[currentQuest.quest_id - 1]?.every(Boolean))
                                            || completedMissions[currentQuest.quest_id]?.[index - 1];
                                        const isCompleted = completedMissions[currentQuest.quest_id]?.[index];
                                        const hoverColor = hoverColors[index % hoverColors.length]; // Cycle through hover colors
                                        // For non-active quests, return a locked card
                                        if (!isTrackingActiveQuest && !isUnlocked) {
                                            return (
                                                <div className=' '>
                                                    <Card
                                                        key={index}
                                                        className="bg-gray-200 w-[264px] h-40"
                                                    >
                                                        <CardBody >
                                                            <div className="flex gap-3 items-center">
                                                                <img className="w-[18px] h-5" src={lockedLogo} alt="Locked" />
                                                                <h2 className="w-[193px] text-[#6f6d6d] text-xs font-normal font-['Inter']">Mission {index + 1}</h2>
                                                            </div>
                                                            <h2 className="w-[232px] text-[#1e1e1e] text-2xl mt-2 font-bold font-['Inter']">
                                                                M{index + 1}: {mission.title}
                                                            </h2>
                                                        </CardBody>
                                                        <CardFooter className="mt-4" >
                                                            <span className="text-sm text-gray-600 px-2 py-1 rounded-full">

                                                            </span>
                                                        </CardFooter>
                                                    </Card>
                                                </div>
                                            );
                                        }

                                        // Display mission tracking for the active quest
                                        return (
                                            <>
                                                <Card
                                                    key={index}
                                                    className={`${isUnlocked ? '' : 'bg-gray-200'} w-[264px] h-40 relative ${!isUnlocked ? '' : `${hoverColor} cursor-pointer`} rounded-lg border-2 border-[#9e9d9d]`}
                                                    onClick={() => isUnlocked && handleStartMission(currentQuest, mission)}
                                                >
                                                    {/* Mission ID and Title */}
                                                    <div className="absolute left-[16px] top-[23.5px] text-[#6f6d6d] text-xs flex items-center font-normal font-['Inter']">
                                                        {!isUnlocked && (
                                                            <img src={lockedLogo} className="max-w-full w-[18px] h-5 mr-2" alt="Locked" />
                                                        )}
                                                        <p className='text-[#6f6d6d] text-xs font-normal font-["Inter"]'>
                                                            Mission {index + 1}
                                                        </p>


                                                    </div>
                                                    <div className="absolute left-[16px] top-[47px] w-[232px] text-[#1e1e1e] text-2xl font-bold font-['Inter']">
                                                        M{index + 1}: {mission.title}
                                                    </div>

                                                    {/* Lock or mission indicator */}
                                                    <div className="absolute left-[16px] top-[120px] flex justify-center items-center gap-3">
                                                        {isCompleted && isUnlocked ? (
                                                            <span className="text-sm font-normal font-['Inter'] leading-3 bg-[#6fcf97]/40 text-black w-[84px] h-6 px-[5px] py-1.5 rounded-lg">
                                                                Completed
                                                            </span>
                                                        ) : isUnlocked ? (
                                                            <span className="bg-[#f2c84c]/40 rounded-lg text-black text-xs w-[69px] h-6 px-[5px] py-1.5 font-normal font-['Inter'] leading-3">
                                                                Start Here
                                                            </span>
                                                        ) : !isUnlocked && (
                                                            <span className="text-sm bg-[#9747ff]/40 rounded-lg w-[69px] h-6 px-[5px] text-black py-1.5 font-normal font-['Inter'] leading-3">
                                                                Up Next
                                                            </span>
                                                        )}
                                                    </div>
                                                </Card>


                                                {/* PRETTY COOL DESIGN WHEN UNCOMMENTED */}
                                                {/* <div className='flex flex-wrap justify-between mx-12 mt-10'>
                                                    <Button
                                                        onClick={handleBackToQuests}
                                                        variant={'text'}
                                                        className="h-[60px] px-7 py-[18px] bg-white rounded-[15px] border-2 border-[#087eff] justify-center items-center gap-2.5 inline-flex"
                                                    >
                                                        <p className="text-blue text-base font-bold font-['Inter'] leading-none">Back to Quests</p>
                                                    </Button>
                                                    {isNextQuestAvailable() && (
                                                        <>
                                                            <Button
                                                                onClick={handleNextQuest}
                                                                variant={'text'}
                                                                className="h-[60px] px-7 py-[18px] bg-[#087eff] rounded-[15px] justify-center items-center gap-2.5 inline-flex"
                                                            >
                                                                Next Quest
                                                            </Button>
                                                            {isConfettiVisible && (
                                                                <Confetti width={width} height={height} numberOfPieces={2500} />
                                                            )}
                                                        </>
                                                    )}

                                                </div> */}
                                            </>

                                        );
                                    })
                                ) : (
                                    <p className="text-center col-span-full">No missions available for this quest.</p>
                                )}

                            </div>

                            <div className='container mt-10'>
                                <div className='flex justify-between mx-12'>
                                    <Button
                                        onClick={handleBackToQuests}
                                        variant={'text'}
                                        className="h-[60px] px-7 py-[18px] bg-white rounded-[15px] border-2 border-[#087eff] justify-center items-center gap-2.5 inline-flex"
                                    >
                                        <p className="text-blue text-base font-bold font-['Inter'] leading-none">Back to Quests</p>
                                    </Button>
                                    {isNextQuestAvailable() && (
                                        <>
                                            <Button
                                                onClick={handleNextQuest}
                                                variant={'text'}
                                                className="h-[60px] px-7 py-[18px] bg-[#087eff] rounded-[15px] items-center gap-2.5"
                                            >
                                                Next Quest
                                            </Button>
                                            {isConfettiVisible && (
                                                <Confetti width={width} height={height} numberOfPieces={2500} />
                                            )}
                                        </>
                                    )}
                                </div>

                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center my-[58px]">
                                <h1 className="text-[40px] font-bold leading-10 ">
                                    Welcome to Your Job <br /> Search Adventure!
                                </h1>
                            </div>
                            <div className="flex flex-wrap gap-4" onClick={onQuestsClick}>
                                {quests.map((quest, index) => {
                                    // Determine if the quest is locked
                                    const previousQuest = quests.find(q => q.quest_id === quest.quest_id - 1);
                                    const previousQuestCompleted = typeof previousQuest?.missions === 'number' && completedMissions[quest.quest_id - 1]?.length === previousQuest.missions;
                                    const isLocked = quest.quest_id !== 1 && (!completedMissions[quest.quest_id - 1] || !previousQuestCompleted);
                                    const hoverColor = hoverColors[index % hoverColors.length]; // Cycle through hover colors

                                    // Calculate the total number of missions and completed missions for the current quest
                                    const totalMissions = quest.missions;
                                    const completedCount = completedMissions[quest.quest_id]
                                        ? completedMissions[quest.quest_id].filter(Boolean).length
                                        : 0;


                                    return (
                                        <Card
                                            key={quest.quest_id}
                                            className={`${!isLocked ? '' : 'bg-gray-200'} w-[264px] h-40 relative ${isLocked ? '' : `${hoverColor} cursor-pointer`} relative rounded-lg border-2 border-[#9e9d9d]`}
                                            style={{ width: '264px', height: '160px' }} // Explicitly setting width and height to match the design
                                            onClick={() => !isLocked && handleSelectQuest(quest)}
                                        >
                                            {/* Quest ID */}
                                            <div className="absolute left-[16px] top-[23.5px] text-[#6f6d6d] text-xs flex items-center font-normal font-['Inter']">
                                                {isLocked && (
                                                    <img src={lockedLogo} className="max-w-full w-[18px] h-5 mr-2" alt="Locked" />
                                                )}
                                                <p className='text-[#6f6d6d] text-xs font-normal font-["Inter"]'>
                                                    Quest {quest.quest_id}
                                                </p>
                                            </div>

                                            {/* Quest Title */}
                                            <div className="absolute left-[16px] top-[46px] w-[232px] text-[#1e1e1e] text-2xl font-bold font-['Inter']">
                                                {quest.title}
                                            </div>

                                            {/* Missions Icon Placeholder */}
                                            <div className="absolute left-[16px] top-[128px] w-4 h-4">
                                                <img src={arrowIcon} alt="Arrow Icon" /> {/* Add the arrow icon here */}
                                            </div>

                                            {/* Missions Count */}
                                            <div className="absolute left-[36px] top-[128.5px] text-[#6f6d6d] text-xs font-medium font-['Inter']">
                                                {quest.missions} missions
                                            </div>

                                            {/* Completed Missions Count */}
                                            {!isLocked && (
                                                <div className="absolute left-[162px] top-[128.5px] text-[#6f6d6d] text-xs font-medium font-['Inter']">
                                                    {completedCount}/{totalMissions} Completed
                                                </div>
                                            )}
                                        </Card>


                                    );
                                })}

                            </div>

                        </>
                    )}

                    <Dialog
                        open={open}
                        handler={handleOpenDialog}
                        ref={dialogRef}
                        className="bg-white rounded-[15px] border-2 border-[#9e9d9d] overflow-y-scroll max-h-[70vh] mx-auto"
                        style={{ minHeight: '524px', height: 'auto', maxWidth: '544px', minWidth: 'auto' }}
                    >
                        <DialogHeader>
                            <div className="dialog-header flex w-full">
                                <X onClick={() => setOpen(false)} className="cursor-pointer" />
                            </div>
                        </DialogHeader>
                        <DialogBody ref={dialogBodyRef} className='dialog-body w-full sm:w-[90%] mx-auto'>
                            <div>
                                {selectedMission ? (
                                    <>
                                        <div className='text-center'>
                                            <h2 className="text-5xl font-bold relative bottom-[40px]">
                                                Q{currentQuest?.quest_id}: Mission {selectedMission.mission_id}
                                            </h2>
                                            <p className="text-5xl font-bold relative bottom-[40px]">{selectedMission.title}</p>
                                        </div>

                                        {selectedMission.mission_id === 1 && currentQuest?.quest_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] h-[38px] text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p className='text-lg'>Search for jobs you want to apply to. We love these sites to look for great roles:</p>
                                                    </div>
                                                    <div className='flex flex-wrap mt-10 gap-10 justify-center mb-5 items-center'>
                                                        <a href='https://www.linkedin.com/'><img className='max-w-full h-auto' src={linkedInLogo} /></a>
                                                        <a href='https://www.indeed.com/'><img className='max-w-full h-auto' src={indeedLogo} /></a>
                                                        <a href='https://uk.welcometothejungle.com/'><img className='max-w-full h-auto' src={ottaLogo} alt="Otta" /></a>
                                                        <a href='https://joincreatively.com/companies/home'><img className='max-w-full h-auto' src={creativelyLogo} alt="Creatively" /></a>

                                                    </div>
                                                    <div className="w-[493px] h-[75px] text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>But you can also search for jobs on online forums, subscribe to monthly job posting newsletters,
                                                            your school’s job board, directly on a company’s website, AngelList, FlexJobs, and many other places.
                                                            Think outside the box!
                                                        </p>
                                                        <p className="mt-4">Once you find a few that you are at least an 80% match for the qualifications, add them to your <span className="font-bold"><a href='/job-tracking' className='underline text-red-600'>Job Follow-Up Board</a></span>.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {selectedMission.mission_id === 2 && currentQuest?.quest_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className='flex flex-wrap justify-center relative bottom-[35px] w-full'>
                                                        <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-center'>High-Interest Jobs</h2> {/* Responsive font size and centered text */}
                                                    </div>
                                                    <div className='ml-3 flex flex-wrap w-full'>
                                                        <div className='w-full'>
                                                            <h3 className='text-xl sm:text-2xl font-bold mb-5'>Prioritize</h3> {/* Responsive font size */}
                                                        </div>
                                                        <div className="w-full sm:w-[80%] lg:w-[80%] text-[#1e1e1e] flex flex-col text-base font-normal font-['Inter']">
                                                            <p className='mb-5'>Instructions: Review your Job Follow-Up Board and filter for jobs with a Motivation Score of 5 (High Interest).
                                                                Ensure these roles align with your skills and career goals. If you have fewer than 3, revisit your search and
                                                                find at least 3 that excite you.
                                                            </p>
                                                            <p className=''>Tip: Focus on quality over quantity. Choose roles that truly match your aspirations to stay motivated and boost
                                                                your chances of success.
                                                            </p>
                                                        </div>
                                                        <div className="w-full sm:w-[80%] lg:w-[80%] text-black flex flex-col text-base font-normal font-['Inter'] mt-10">
                                                            <h3 className='text-xl sm:text-2xl font-bold mb-5'>Research</h3> {/* Responsive font size */}
                                                            <p className='mb-5'>Instructions: Spend 10-15 minutes researching each high-interest company. Check their website, recent news,
                                                                and company culture. Add insights to your Job Follow-Up Board.
                                                            </p>
                                                            <p>Tip: Tailor your resume and cover letter with company-specific details like recent product launches or community
                                                                initiatives to stand out.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </>
                                        )}

                                        {selectedMission.mission_id === 3 && currentQuest?.quest_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] flex flex-wrap text-black text-base font-normal font-['Inter']">
                                                        <p className='mb-5'>Instruction: Go to LinkedIn and search for the company name. Use filters like 'People' to find key contacts, such as
                                                            hiring managers, recruiters, or team leads for the department you want to join. For each high-interest job, identify
                                                            1-2 contacts and add their names, job titles, and LinkedIn profiles to your spreadsheet under a new column labeled
                                                            'Key Contacts.' This will be valuable for networking and follow-up efforts later in the application process.
                                                        </p>
                                                        <p className='mb-5'>Tip: If you can’t find a recruiter or hiring manager, look for team leads or senior employees in your target department.
                                                            Connecting with these people can also give you insights and increase your visibility when your application is being reviewed.
                                                        </p>
                                                        <p>Tip: You can also see if you have any existing connections that work at the company. Being able to reach out to your existing
                                                            contacts for a referral could mean the difference between applying and landing that interview.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {selectedMission.mission_id === 4 && currentQuest?.quest_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-full sm:w-[70%] lg:w-[90%] flex flex-wrap text-black text-base font-normal font-['Inter']">
                                                        <p className='mb-5'>Instruction: In your Job Follow-Up Board, sort your high-interest jobs by Application Deadline (or manually mark those with “Apply Soon” if no
                                                            deadline is specified). Highlight any jobs that need to be applied to within the next 3 days. This will be your top priority list to tackle first.
                                                            Next, rank the remaining jobs by factors like company interest, role fit, or job requirements, and make note of which ones to focus on afterward.
                                                        </p>
                                                        <p>Tip: Prioritizing jobs with tight deadlines ensures you never miss out on applying for a great opportunity. Staying organized by urgency helps you
                                                            make strategic decisions about where to focus your time and effort.</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* {quest 2 missions} */}
                                        {currentQuest?.quest_id === 2 && selectedMission.mission_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] flex flex-wrap text-[#1e1e1e] text-base font-normal font-['Inter'] mb-16">
                                                        <p className=''>Instructions: Write a clear, attention-grabbing headline that includes your target job title, core skills, and unique strengths (up to 220 characters).
                                                            Use relevant keywords to match the roles you're aiming for. If you need help, ask ChatGPT to suggest one based on your desired job and resume. Here is
                                                            an example of an impactful LinkedIn headline:
                                                        </p>
                                                    </div>
                                                    <div className="w-[494px] h-[245px] mb-5">
                                                        <img src={headlineLogo} />
                                                    </div>
                                                    <div className="w-[493px] h-[39px] text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>Tip: If you go to the qualifications section of a job description on LinkedIn, you can add skills from the description directly to you profile. See the video below:</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}


                                        {currentQuest?.quest_id === 2 && selectedMission.mission_id === 2 && (
                                            <>
                                                <div className="ml-3 flex flex-wrap">
                                                    <div className="w-[495px] h-[211px] text-[#1e1e1e] space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instructions: Research 5-7 job descriptions for your target role to identify key skills. Update both your LinkedIn profile and resume with those skills
                                                            to reflect current trends. Highlight your top skills to boost recruiter visibility.
                                                        </p>
                                                        <p>
                                                            Tip: Having at least 10 relevant skills increases your chances of appearing in recruiter searches.
                                                        </p>
                                                        <p>
                                                            Tip: If you go to the qualifications section of a job description on LinkedIn, you can add skills from the description directly to you profile. See the video below:
                                                        </p>
                                                    </div>

                                                    <div className='mt-40'>
                                                        <img src={rectangleLogo} />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {currentQuest?.quest_id === 2 && selectedMission.mission_id === 3 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] h-[189px] space-y-5 text-black text-base font-normal font-['Inter']">
                                                        <p>Instruction: Identify any missing skills from the previous mission. Use ChatGPT to find quick ways to upskill, such as free or low-cost online courses. Create a simple
                                                            plan to dedicate time each day to learning these skills.
                                                        </p>
                                                        <p>Tip: Look for free resources or project-based platforms to learn quickly and effectively.

                                                        </p>
                                                        <p>Tip: LinkedIn has a lot of free courses available, for different skillsets.

                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {currentQuest?.quest_id === 2 && selectedMission.mission_id === 4 && (
                                            <>
                                                <div className="ml-3 flex flex-wrap">
                                                    <div className="w-[495px] sm:w-[770%] lg:w-[90%] space-y-5 text-black text-base font-normal font-['Inter']">
                                                        <p>Instruction: Summarize your professional background, key achievements, and unique strengths in your LinkedIn "About" section. Keep it concise but impactful, and ensure
                                                            it aligns with the roles you're targeting. Use ChatGPT for assistance if needed.
                                                        </p>
                                                        <p>Tip: Make your “About” section tell your career story while highlighting relevant accomplishments.

                                                        </p>
                                                        <p>Tip: Writing your About section in the first person makes it more personal and relatable, helping you connect with recruiters on a human level. It also creates a conversational
                                                            tone, making your profile feel more authentic and approachable. Check out this article for examples of great “about” sections.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {currentQuest?.quest_id === 2 && selectedMission.mission_id === 5 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[770%] lg:w-[90%] space-y-5 text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>Instructions: Update your LinkedIn profile to let recruiters know you're open to new opportunities. You can choose to share this with all LinkedIn members or only with recruiters,
                                                            depending on your privacy preferences.
                                                        </p>
                                                        <p>Tip: If you're employed, select "Only Recruiters" for a discreet job search.

                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {currentQuest?.quest_id === 2 && selectedMission.mission_id === 6 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] h-[229px] space-y-5 text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>Instructions: Connect with people you know, including past colleagues and industry contacts. Send personalized messages to key contacts to strengthen relationships and increase your
                                                            visibility.
                                                        </p>
                                                        <p>Tip: Aim for at least 50 connections to boost your profile’s ranking in search results.

                                                        </p>
                                                        <p>
                                                            Tip: If you see that a fellow alum of your school works at a company you are interested in, try connecting with them! Being able to connect on shared experiences and interests can open a
                                                            path for further communication.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {currentQuest?.quest_id === 2 && selectedMission.mission_id === 7 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] space-y-5 text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>Instruction: Use a clear, professional headshot for your profile picture. For the cover photo, choose an image that reflects your industry or professional brand. Look for royalty-free
                                                            photos or ask ChatGPT for ideas on what would resonate in your field.
                                                        </p>
                                                        <p>

                                                            Tip: A friendly, polished profile photo can improve your first impression with recruiters. For examples of Profile Photos and Cover Photos that inspire, check out this article.
                                                        </p>
                                                    </div>
                                                    <img className='mt-10' src={linkedinLogo2} />
                                                </div>
                                            </>
                                        )}
                                        {currentQuest?.quest_id === 2 && selectedMission.mission_id === 8 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] h-[191px] space-y-5 text-black text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instruction: Identify and follow 10-20 employers in your target industry. This helps you stay updated on new job postings and company news.
                                                        </p>
                                                        <p>
                                                            Tip: Prioritize companies that frequently hire for your desired role and have positive reputations.
                                                        </p>
                                                        <p>
                                                            Tip: Utilize <a className='underline text-red-600 font-bold' href='https://www.glassdoor.com/'>Glassdoor</a> to research companies work culture and environment to see if that company aligns with your goals and work styles.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 3 && selectedMission.mission_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] h-[58px] text-[#1e1e1e] mb-10 text-base font-normal font-['Inter']">
                                                        <p>Instructions: Open your Job Follow-Up Board and sort the jobs marked as "High Interest" to appear at the top. Prioritize these jobs to focus
                                                            on the roles that best match your goals.
                                                        </p>
                                                    </div>
                                                    <div className="w-[493px] h-14 text-[#1e1e1e] mb-10 text-base font-normal font-['Inter']">
                                                        <p>Tips: Prioritize jobs where your experience directly matches the qualifications and responsibilities. This increases the likelihood of making
                                                            a strong impression.
                                                        </p>

                                                    </div>
                                                    <div className="w-[493px] h-14 text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>Tips: Avoid applying to roles just to “see what happens.” Focus on jobs that truly excite you or align with your career growth, as this will
                                                            come through in your tailored application.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 3 && selectedMission.mission_id === 2 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-[#1e1e1e] space-y-5 text-base font-normal font-['Inter']">
                                                        <p>Instructions: Choose a high-interest job from your Job Follow-Up Board. Use ChatGPT to analyze the job description and your resume with the prompt:

                                                        </p>
                                                        <p>
                                                            "I’m applying for [Job Title] at [Company]. Here's my resume and the job description. How can I tailor my resume to maximize my chances of getting
                                                            an interview?" Apply the suggestions to emphasize key skills and experience.
                                                        </p>
                                                        <p>Tip: Use keywords from the job description to ensure your resume passes Applicant Tracking Systems (ATS). For examples and templates for great
                                                            ATS-friendly resumes, <a className='text-red-600 font-bold underline' href='https://www.rezi.ai/posts/ats-resume-examples'>check out this article.</a></p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 3 && selectedMission.mission_id === 3 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[100%] text-black space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instruction: Find the saved job URL in your Job Follow-Up Board and open the listing. Submit your tailored resume and any other required documents, ensuring everything is accurate.
                                                        </p>
                                                        <p>
                                                            Tip: Review all fields and attachments for accuracy before submitting. Simple mistakes can disqualify your application.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 3 && selectedMission.mission_id === 4 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] h-[115px] text-black space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instruction: After applying, mark the job status as "Applied" in your Job Follow-Up Board. Record the application date and any relevant notes (e.g., recruiter info or confirmation numbers).
                                                        </p>
                                                        <p>
                                                            Tip: Keeping track of applications ensures you're organized and ready for timely follow-ups.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 4 && selectedMission.mission_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-[#1e1e1e] space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instructions: Open your Job Follow-Up Board and filter the jobs marked as “Applied.” Sort by the “Date Applied” to see the most recent applications. This will help you stay organized and track which
                                                            jobs need follow-ups.
                                                        </p>
                                                        <p>
                                                            Tips: Regularly checking your applied jobs helps ensure you're ready for any responses or upcoming deadlines.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 4 && selectedMission.mission_id === 2 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-[#1e1e1e] space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            nstructions: Review each job in your Job Follow-Up Board and add the application deadline to the "Notes" section. For jobs with deadlines within the next 3 days, label them as "Urgent" in the notes.
                                                            For deadlines within a week, mark them as "Upcoming." This will help you prioritize which applications to complete first.
                                                        </p>
                                                        <p>
                                                            Tip: Tracking deadlines in your notes helps you stay organized and ensures you don’t miss key opportunities. Focus on urgent applications to keep your job search moving forward.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 4 && selectedMission.mission_id === 3 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] h-[119px] text-black space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instruction: Find the saved job URL in your Job Follow-Up Board and open the listing. Submit your tailored resume and any other required documents, ensuring everything is accurate.
                                                        </p>
                                                        <p>
                                                            Tip: Tackle applications with the closest deadlines first. Dedicate time to avoid last-minute stress.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 5 && selectedMission.mission_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap gap-y-20'>
                                                    <div className="w-[495px] h-[77px] text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instructions: For jobs you’ve already applied to, go to LinkedIn and search for recruiters or hiring managers at the company. Use titles like “Talent Acquisition,” “Recruiter,”
                                                            or “Hiring Manager” along with the company name to narrow your search.
                                                        </p>

                                                    </div>
                                                    <div className="w-[493px] h-[42px] text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>
                                                            Tips: The name and the profile of the recruiter or hiring manager is usually on the job listing. Try searching there first.
                                                        </p>

                                                    </div>
                                                    <div className="w-[493px] h-14 text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>
                                                            Tips: If you’re unable to find the specific recruiter, try looking for other HR professionals at the company. Often, multiple HR contacts can help direct you to the right person.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 5 && selectedMission.mission_id === 2 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-[#1e1e1e] space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instructions: Once you find the recruiter or hiring manager, send a connection request. Use ChatGPT to craft a personalized message:
                                                        </p>
                                                        <p>
                                                            “I recently applied for [Job Title] at [Company]. Can you help me write a connection request message expressing my interest in the role?” Edit the message as needed and send the request.
                                                        </p>
                                                        <p>
                                                            Tip: Keep your message short and highlight your recent application to show genuine interest. Mention something specific about the company to make the message feel personal.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 5 && selectedMission.mission_id === 3 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-black space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instruction: If the recruiter or hiring manager accepts your connection, follow up by thanking them and reiterating your enthusiasm for the role. Use ChatGPT to generate a follow-up message
                                                            and customize it based on your interaction:
                                                        </p>
                                                        <p>
                                                            “Thanks for connecting! I recently applied for [Job Title] and wanted to express my enthusiasm. Could you provide any insights about the team or the next steps in the process?”
                                                        </p>
                                                        <p>
                                                            Tip: Review all fields and attachments for accuracy before submitting. Simple mistakes can disqualify your application.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 6 && selectedMission.mission_id === 1 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-[#1e1e1e] text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instructions: Go to your Job Follow-Up Board and filter for jobs that have been marked as “Applied” and have not received a response in 4 or more days. These jobs should be flagged for follow-up,
                                                            indicating they may need an additional nudge to get noticed by the recruiter.
                                                        </p>
                                                        <p>
                                                            Tips: Following up after 4–7 days is an optimal time frame. It’s long enough for the recruiter to have reviewed applications but short enough to show that you’re still enthusiastic about the position.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 6 && selectedMission.mission_id === 2 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-[#1e1e1e] space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instruction: For each job that needs follow-up, open ChatGPT and use the following prompt:
                                                        </p>
                                                        <p>
                                                            “I applied for [Job Title] at [Company] 4 days ago and haven’t received a response. Can you help me write a professional follow-up email to the recruiter?”
                                                        </p>
                                                        <p>
                                                            Review the generated follow-up message and adjust it to reflect your personal style. Send the follow-up message via email or LinkedIn, and keep the tone polite and enthusiastic.
                                                        </p>

                                                    </div>
                                                    <div className="w-[493px] h-24 text-black text-base mt-[60px] font-normal font-['Inter']">
                                                        <p>
                                                            Tip: Always reference the role and date of application in your message. Reaffirm your interest in the position, and ask if there are any updates or additional materials you can provide. This will increase
                                                            the chances of your message being read and your application being reconsidered.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 6 && selectedMission.mission_id === 3 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-black text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instruction: After sending your follow-up message, update the job status to "Followed Up" in your Job Follow-Up Board. Record the date and add relevant notes about the interaction, such as the recruiter's
                                                            response or any next steps. Repeat this process for any additional jobs that meet the 4+ days criteria for follow-up.
                                                        </p>
                                                        <p>
                                                            Tips: Accurately tracking follow-ups keeps your job search organized and professional. Consistent follow-ups can set you apart, showing initiative and persistence that recruiters appreciate.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentQuest?.quest_id === 6 && selectedMission.mission_id === 4 && (
                                            <>
                                                <div className='ml-3 flex flex-wrap'>
                                                    <div className="w-[495px] sm:w-[70%] lg:w-[90%] text-black space-y-5 text-base font-normal font-['Inter']">
                                                        <p>
                                                            Instruction: Take a moment to review your progress across all quests. Reflect on the jobs you’ve applied for, the follow-ups you've completed, and any responses you've received. Use your Job Follow-Up Board
                                                            to assess which applications need further attention or follow-up and which ones might be worth revisiting. Based on this reflection, adjust your job search strategy if necessary and plan the next steps for
                                                            your search.
                                                        </p>
                                                        <p>
                                                            Tip: Regularly reflecting on your job search helps you stay proactive and focused. Adjusting your approach as you gather feedback and insights will keep your efforts aligned with your goals.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    </>
                                ) : (
                                    <p>No mission selected.</p>
                                )}
                            </div>

                            {/* Finish button inside the DialogBody */}
                            <div className="flex justify-between mt-[160px]">
                                <Button onClick={handleBackMission} className="bg-gray-400 text-white font-bold rounded-[15px] px-7 py-[18px]" variant={'text'} >
                                    Back
                                </Button>
                                <Button onClick={handleFinishMission} disabled={!isNextDisabled} className="bg-[#087eff] text-white font-bold rounded-[15px] px-7 py-[18px]" variant={'text'} >
                                    Finish
                                </Button>
                            </div>
                        </DialogBody>
                    </Dialog>
                </div >
            </div>
        </>
    );
};

export default QuestPage;
