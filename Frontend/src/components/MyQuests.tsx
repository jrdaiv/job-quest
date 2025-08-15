import React, { useState } from 'react';
import Instructions from './Instructions';
import NavigationBar from './NavigationBar';
import Quests from './Quests';

const MyQuests: React.FC = () => {
  // State to track whether the user clicked on a quest
  const [hasClickedQuest, setHasClickedQuest] = useState(false);

  // Function to handle quest click and hide Instructions
  const handleQuestsClick = () => {
    setHasClickedQuest(true); // Set to true when quest is clicked, hiding Instructions
  };

  return (
    <div>
      <NavigationBar />

      {/* Render the Quests component and pass the click handler */}
      <Quests onQuestsClick={handleQuestsClick} />

      {/* Conditionally hide Instructions after the quest is clicked */}
      <div className=''>
        {!hasClickedQuest && <Instructions />}
      </div>
    </div>
  );
};

export default MyQuests;
