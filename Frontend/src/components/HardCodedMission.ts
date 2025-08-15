export interface Quest {
  quest_id: number;
  title: string;
  missions: any;  
}

export interface Mission {
  mission_id: number;
  title: string;
  completed: boolean;
}

export const hardcodedMissions: Mission[] = [
  { mission_id: 1, title: "Search for Jobs", completed: false },
  { mission_id: 2, title: "Prioritize and Research", completed: false },
  { mission_id: 3, title: "Identify Key Contacts", completed: false },
  { mission_id: 4, title: "Prioritize Jobs by Urgency", completed: false },
];

export const hardcodedMissions2: Mission[] = [
  { mission_id: 1, title: "Write a Linkedin Headline", completed: false },
  { mission_id: 2, title: "Update Skills", completed: false },
  { mission_id: 3, title: "Address Skills Graps", completed: false },
  { mission_id: 4, title: 'Write an "About" Section', completed: false },
  { mission_id: 5, title: 'Set "Open to Work" Status', completed: false },
  { mission_id: 6, title: "Grow your Network", completed: false },
  { mission_id: 7, title: "Update Profile and Cover Photos", completed: false },
  { mission_id: 8, title: "Follow Key Employers", completed: false },
];

export const hardcodedMissions3: Mission[] = [
  { mission_id: 1, title: "Prioritize High-Interest Jobs", completed: false },
  { mission_id: 2, title: "Tailor Your Resume for the Job", completed: false },
  { mission_id: 3, title: "Apply to the Job", completed: false },
  { mission_id: 4, title: "Update Your Follow-Up Board", completed: false },
];

export const hardcodedMissions4: Mission[] = [
  { mission_id: 1, title: "Review Jobs You've Applied To", completed: false },
  { mission_id: 2, title: "Identify Deadlines", completed: false },
  { mission_id: 3, title: "Submit Applications", completed: false },
];

export const hardcodedMissions5: Mission[] = [
  { mission_id: 1, title: "Find Recruiters on Linkedin", completed: false },
  { mission_id: 2, title: "Send Request to Connect", completed: false },
  { mission_id: 3, title: "Send a Follow-Up Message", completed: false },
];

export const hardcodedMissions6: Mission[] = [
  { mission_id: 1, title: "Filter Jobs Needing Follow-Up", completed: false },
  { mission_id: 2, title: "Follow Up on Your Application", completed: false },
  { mission_id: 3, title: "Update and Track Follow-Ups", completed: false },
  { mission_id: 4, title: "Reflect and Plan Next Steps", completed: false },
];
