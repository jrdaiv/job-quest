import React, {
  FormEvent,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import JobTrackingLogo from "../assets/Screenshot 2024-09-26 104931.png";
import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { X, Pencil, Calendar, Hourglass, HandHeart, Info } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import heartIcon from "../assets/Icons/Heart Icon.svg";
import editIcon from "../assets/Icons/Edit Icon.svg";
import trashIcon from "../assets/Icons/Trash Icon.svg";
import addIcon from "../assets/Icons/Add Icon.svg";
import sortIcon from "../assets/Icons/Sort Icon.svg";
import filterIcon from "../assets/Icons/Filter Icon.svg";
import checkIcon from "../assets/Icons/Check Icon.svg";
import emptyHeartIcon from "../assets/Icons/Empty Heart Icon.svg";
import "inter-ui";

interface JobsData {
  job_id: number;
  user_id: number;
  position: string;
  url: string;
  notes: string;
  status: string;
  date_applied: string;
  reminder_date: string;
  company_name: string;
  motivation: number;
  recruiter: {
    name: string;
    url: string;
  };
  hiring_manager: {
    name: string;
    url: string;
  };
}

interface DecodedToken {
  sub: {
    id: number;
  };
}

const JobTracking: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobsData[]>([]);
  const [hasJobs, setHasJobs] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false); // Tracks if we are in edit mode
  const [sortField, setSortField] = useState<string>("date_applied"); // Default sort by date_applied
  const [sortOrder, setSortOrder] = useState<string>("asc"); // Ascending or Descending
  const [filterText, setFilterText] = useState<string>(""); // Filter text for job filtering
  const [filterMotivation, setFilterMotivation] = useState<number | null>(null); //Filter motivation for job filtering
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false); // To toggle sort dropdown
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false); // To toggle filter dropdwon
  const [showOffCanvas, setShowOffCanvas] = useState(false); // To toggle the off-canvas
  const [selectedJob, setSelectedJob] = useState<JobsData | null>(null); // Store the selected job
  const [selectedSortField, setSelectedSortField] = useState<string | null>(
    null
  ); // Store the selected sort filed
  const [selectedFilterField, setSelectedFilterField] = useState<{
    status: string | null;
    motivation: number | null;
  }>({ status: null, motivation: null }); // Store the selected filter field
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const handleClose = () => setShowOffCanvas(false); // Handle closing the off-canvas
  const navigate = useNavigate();

  const [jobData, setJobData] = useState<JobsData>({
    job_id: 0, // Default ID is 0 for new jobs
    user_id: 0,
    position: "",
    url: "",
    status: "Not Started",
    date_applied: "",
    notes: "",
    reminder_date: "",
    company_name: "",
    motivation: 0,
    recruiter: {
      name: "",
      url: "",
    },
    hiring_manager: {
      name: "",
      url: "",
    },
  });

  // Dialog open for adding a new job
  const handleOpenDialog = () => {
    setIsEditing(false); // Set as adding a new job
    setJobData({
      // Reset form for new job
      job_id: 0,
      user_id: 0,
      position: "",
      url: "",
      status: "Not Started",
      notes: "",
      date_applied: "",
      reminder_date: "",
      company_name: "",
      motivation: 0,
      recruiter: {
        name: "",
        url: "",
      },
      hiring_manager: {
        name: "",
        url: "",
      },
    });
    setOpen(true);
  };

  // Dialog close
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleInput = (event: FormEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    // Check if the input is for recruiter or hiring manager
    if (name.startsWith("recruiter")) {
      setJobData({
        ...jobData,
        recruiter: {
          ...jobData.recruiter,
          [name.replace("recruiter", "").toLowerCase()]: value,
        },
      });
    } else if (name.startsWith("hiringManager")) {
      setJobData({
        ...jobData,
        hiring_manager: {
          ...jobData.hiring_manager,
          [name.replace("hiringManager", "").toLowerCase()]: value,
        },
      });
    } else {
      // For other fields (company_name, position, etc.)
      setJobData({ ...jobData, [name]: value });
    }
  };

  const handleMotivation = (value: number) => {
    setJobData({ ...jobData, motivation: value });
  };

  const saveJob = async () => {
    try {
      const token = localStorage.getItem("access_token"); // Retrieve the JWT from local storage
      if (!token) {
        throw new Error("No access token found");
      }

      const decodedToken = jwtDecode<DecodedToken>(token); // Decode the JWT
      const user_id = decodedToken.sub.id; // Extract the user_id from the decoded token

      const jobInfo = {
        user_id: user_id, // Include the user_id in the jobInfo object
        company_name: jobData.company_name,
        position: jobData.position,
        url: jobData.url,
        motivation: jobData.motivation,
        notes: jobData.notes,
        date_applied: jobData.date_applied,
        reminder_date: jobData.reminder_date,
        status: jobData.status,
        hiring_manager: {
          name: jobData.hiring_manager.name,
          url: jobData.hiring_manager.url,
        },
        recruiter: {
          name: jobData.recruiter.name,
          url: jobData.recruiter.url,
        },
      };

      const response = await axios.post("/api/jobs/register", jobInfo, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });
      setJobs([...jobs, response.data]); // Add the new job to the jobs list
      fetchJobs(true);
      handleCloseDialog(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  // Fetch jobs
  const fetchJobs = useCallback(
    async (forcedUpdate = false) => {
      try {
        const token = localStorage.getItem("access_token"); // Retrieve the JWT from local storage
        if (!token) {
          throw new Error("No access token found");
        }

        const decodedToken = jwtDecode<DecodedToken>(token); // Decode the JWT
        const user_id = decodedToken.sub.id; // Extract the user_id from the decoded token

        const response = await axios.get(
          `/api/jobs/${user_id}/all?forced_update=${forcedUpdate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
          }
        );
        setJobs(response.data);
        setHasJobs(response.data.length > 0);
        navigate("/job-tracking");
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    },
    [navigate]
  ); // Add necessary dependencies like `navigate` here

  // Update the useEffect hook
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]); // Include fetchJobs as a dependency

  // Sorting function
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setSelectedSortField(field); // Track the selected option
    setShowSortDropdown(false); // Hide the dropdown after selecting an option
  };

  // Filtering function
  const handleFilter = (status: string, motivation: number | null) => {
    setFilterText(status);
    setFilterMotivation(motivation);
    setSelectedFilterField({ status, motivation });
    setShowFilterDropdown(false);
  };

  // Sort Dropdown function
  const toggleSortDropdownVisibility = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  // Filter Dropdown function
  const toggleFilterDropdownVisibility = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortDropdownRef, filterDropdownRef]);

  // Sort and filter the jobs
  const sortedAndFilteredJobs = jobs
    .filter(job => {
      const statusMatch = !filterText || job.status === filterText; // Filter by job status
      const motivationMatch =
        !filterMotivation || job.motivation === filterMotivation; // Filter by job motivation
      return statusMatch && motivationMatch;
    })
    .sort((a, b) => {
      if (sortField === "motivation") {
        return sortOrder === "dec"
          ? a.motivation - b.motivation
          : b.motivation - a.motivation;
      }

      const fieldA = a[sortField as keyof JobsData];
      const fieldB = b[sortField as keyof JobsData];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      return 0;
    });

  const handleStatusChange = async (job_id: number, newStatus: string) => {
    try {
      // Make a request to update the job status in the backend
      const response = await axios.put(`/api/jobs/update-job/${job_id}`, {
        status: newStatus, // Send the new status to the backend
      });
      console.log("Job status updated:", response.data);

      // Update the job status in the frontend state
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.job_id === job_id ? { ...job, status: newStatus } : job
        )
      );
      // Fetch the updated job list
      await fetchJobs(true);
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  // Editing a job: Set job data in form
  const handleEditJob = (job: JobsData) => {
    setIsEditing(true); // We're editing an existing job
    setJobData(job); // Populate form with the existing job data
    setOpen(true); // Open the dialog
  };

  // Update an existing job
  const updateJob = useCallback(async () => {
    try {
      const response = await axios.put(
        `/api/jobs/update-job/${jobData.job_id}`,
        jobData
      );
      const updatedJobs = jobs.map(job =>
        job.job_id === jobData.job_id ? response.data : job
      );
      setJobs(updatedJobs);
      await fetchJobs(true);
      handleCloseDialog();
      navigate("/job-tracking");
    } catch (error) {
      console.error("Error updating job:", error);
    }
  }, [jobData, jobs, fetchJobs, navigate]);

  // Deleting a job
  const handleDeleteJob = async (job_id: number) => {
    try {
      await axios.delete(`/api/jobs/delete-job/${job_id}`);
      setJobs(jobs.filter(job => job.job_id !== job_id)); // Remove the deleted job from the state
      fetchJobs(true);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const truncateUrl = (url: string | undefined) => {
    if (!url) return ""; // Return an empty string if url is undefined or null
    return url.length > 30 ? `${url.substring(0, 30)}...` : url;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStyles = (status: string) => {
    switch (status) {
      case "Not Started":
        return { backgroundColor: "#B3B3B3", color: "#202020" };
      case "Resume Tailored":
        return { backgroundColor: "#E2F6FF", color: "#00334B" };
      case "Applied":
        return { backgroundColor: "#C3F5F0", color: "#024F48" };
      case "Followed-up":
        return { backgroundColor: "#DBEDDB", color: "#204F31" };
      case "Interviewing":
        return { backgroundColor: "#FFEFD9", color: "#613B05" };
      case "Rejected":
        return { backgroundColor: "#F2DBCA", color: "#6C3005" };
    }
  };

  const handleDoThisNext = () => {
    if (jobs.length < 2) {
      setSelectedJob(null);
      setShowOffCanvas(true);
      return;
    }

    const statusPriority = {
      "Not Started": 1,
      "Resume Tailored": 2,
      Applied: 3,
      "Followed-up": 4,
      Interviewing: 5,
      Rejected: 6,
    };

    const filteredJobs = jobs.filter(
      job =>
        statusPriority[job.status as keyof typeof statusPriority] !== undefined
    );

    const sortedJobs = filteredJobs.sort((a, b) => {
      if (b.motivation === a.motivation) {
        return (
          statusPriority[a.status as keyof typeof statusPriority] -
          statusPriority[b.status as keyof typeof statusPriority]
        );
      }
      return b.motivation - a.motivation;
    });

    const selectedJob =
      sortedJobs.find(
        job =>
          statusPriority[job.status as keyof typeof statusPriority] <
          statusPriority["Followed-up"]
      ) ||
      sortedJobs[0] ||
      null;

    setSelectedJob(selectedJob);
    setShowOffCanvas(true);
  };

  return (
    <>
      <NavigationBar />
      {!hasJobs ? (
        <>
          <div className="mx-auto text-center">
            <div className="w-80 sm:w-96 h-80 sm:h-96 mx-auto flex items-center relative top-20 sm:top-40">
              <img src={JobTrackingLogo} alt="Job Tracking Logo" />
            </div>
          </div>

          <div className="mx-auto text-center relative top-20 sm:top-40 text-2xl sm:text-3xl font-bold">
            <h2>No Follow-ups Started Yet</h2>
          </div>

          <div className="mx-auto text-center relative top-24 sm:top-44 text-lg sm:text-xl font-semibold">
            <p>Add your saved jobs here to start</p>
          </div>

          <div className="mx-auto text-center my-5">
            <button
              onClick={handleOpenDialog}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg relative top-36 sm:top-48"
            >
              Add Saved Job
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-24 flex flex-col text-center">
            <h2 className="text-3xl font-bold mb-5 mt-10 mx-auto">
              My Personal Job Follow-Up Board
            </h2>
            <p className="text-xl mb-16 mx-auto">
              Here you will find all the jobs that you applied to in the past
              days, weeks, and months.
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-row items-center gap-3 mx-5 my-4">
            <div
              className="flex items-center ml-auto relative"
              ref={sortDropdownRef}
            >
              <img
                src={sortIcon}
                onClick={toggleSortDropdownVisibility}
                className="cursor-pointer hover:bg-[#E6E8EA] rounded-[8px] p-[4px]"
              />
              {showSortDropdown && (
                <div className="absolute top-[30px] mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 font-medium text-xs">
                  <button
                    onClick={() => handleSort("company_name")}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedSortField === "company_name"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedSortField === "company_name" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Company Name
                  </button>
                  <button
                    onClick={() => handleSort("job_title")}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedSortField === "job_title"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedSortField === "job_title" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Job Title
                  </button>
                  <button
                    onClick={() => handleSort("motivation")}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedSortField === "motivation"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedSortField === "motivation" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Motivation
                  </button>
                  <button
                    onClick={() => handleSort("date_applied")}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedSortField === "date_applied"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedSortField === "date_applied" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Date Applied
                  </button>
                  <button
                    onClick={() => handleSort("status")}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedSortField === "status"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedSortField === "status" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Job Status
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center relative" ref={filterDropdownRef}>
              <img
                src={filterIcon}
                onClick={toggleFilterDropdownVisibility}
                className="cursor-pointer hover:bg-[#E6E8EA] rounded-[8px] p-[4px]"
              />
              {showFilterDropdown && (
                <div className="absolute top-[30px] mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 font-medium text-xs">
                  <button
                    onClick={() => handleFilter("Not Started", null)}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedFilterField.status === "Not Started"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedFilterField.status === "Not Started" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Not Started
                  </button>
                  <button
                    onClick={() => handleFilter("Resume Tailored", null)}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedFilterField.status === "Resume Tailored"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedFilterField.status === "Resume Tailored" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Resume Tailored
                  </button>
                  <button
                    onClick={() => handleFilter("Applied", null)}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedFilterField.status === "Applied"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedFilterField.status === "Applied" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Applied
                  </button>
                  <button
                    onClick={() => handleFilter("Followed-up", null)}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedFilterField.status === "Followed-up"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedFilterField.status === "Followed-up" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Followed-up
                  </button>
                  <button
                    onClick={() => handleFilter("Interviewing", null)}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedFilterField.status === "Interviewing"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedFilterField.status === "Interviewing" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Interviewing
                  </button>
                  <button
                    onClick={() => handleFilter("Rejected", null)}
                    className={`block px-4 py-2 text-sm text-gray-700 w-full text-left ${selectedFilterField.status === "Rejected"
                      ? "bg-[#0000000A]"
                      : "hover:bg-[#0000000A]"
                      }`}
                    role="menuitem"
                  >
                    {selectedFilterField.status === "Rejected" && (
                      <img src={checkIcon} className="inline mr-1" />
                    )}
                    Rejected
                  </button>
                  <button
                    onClick={() => handleFilter("", null)} // Clear filter button
                    className="block px-4 py-2 text-sm w-full text-left text-[#087EFF] font-semibold border-t border-[#087EFF] hover:border-opacity-[36%] hover:text-opacity-[36%]"
                    role="menuitem"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleDoThisNext}
              className="text-[#007AFF] border-[#007AFF] border-2 py-[12px] px-[16px] rounded-[4px] w-[136px] flex justify-center font-bold hover:opacity-[36%]"
            >
              Do This Next
            </button>
            <button
              onClick={handleOpenDialog}
              className="bg-[#007AFF] text-white py-[12px] px-[16px] rounded-[4px] w-[134px] flex justify-center font-bold hover:opacity-[36%]"
            >
              <img src={addIcon} className="mr-[4px]" />
              Add Jobs
            </button>
          </div>

          <div className="overflow-x-auto ">
            <div className="container-fluid">
              <table className="hidden sm:table min-w-full bg-white border-collapse">
                <thead>
                  <tr>
                    <th className="pl-4 py-2 border-b">#</th>
                    <th className="py-2 border-b">Company</th>
                    <th className="py-2 border-b">Job Title</th>
                    <th className="py-2 border-b">Job Interest</th>
                    <th className="py-2 border-b">Job URL</th>
                    <th className="py-2 border-b">Job Status</th>
                    <th className="py-2 border-b">Applied Date</th>
                    <th className="py-2 border-b"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredJobs.map((job, index) => (
                    <tr key={job.job_id} className="text-center">
                      <td className="pl-4 py-2 border-b">{index + 1}.</td>
                      <td className="py-2 border-b">{job.company_name}</td>
                      <td className="py-2 border-b text-start">{job.position}</td>
                      <td className="py-2 border-b text-start">
                        {Array.from({ length: job.motivation }).map((_, i) => (
                          <img key={i} src={heartIcon} className="inline-block mx-[2px]" />
                        ))}
                      </td>
                      <td className="py-2 border-b">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline break-all"
                        >
                          {truncateUrl(job.url)}
                        </a>
                      </td>
                      <td className="py-2 border-b">
                        <select
                          value={job.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(job.job_id, e.target.value)
                          }
                          className="w-full sm:w-[165px] border py-1 rounded-[20px] text-center font-bold"
                          style={getStyles(job.status)}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Resume Tailored">Resume Tailored</option>
                          <option value="Applied">Applied</option>
                          <option value="Followed-up">Followed-up</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-2 border-b">{formatDate(job.date_applied)}</td>
                      <td className="py-2 border-b">
                        <button
                          className="text-black py-1 px-3 rounded-lg mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditJob(job);
                          }}
                        >
                          <img src={editIcon} />
                        </button>
                        <button
                          className="text-black py-1 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJob(job.job_id);
                          }}
                        >
                          <img src={trashIcon} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card Layout */}
              <div className="sm:hidden space-y-4">
                {sortedAndFilteredJobs.map((job, index) => (
                  <div
                    key={job.job_id}
                    className="border rounded-lg p-4 bg-white shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="font-bold">#{index + 1}</h2>
                      <p className="font-semibold">{job.company_name}</p>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">{job.position}</p>

                    <div className="flex items-center mb-2">
                      <span className="font-semibold mr-2">Interest:</span>
                      {Array.from({ length: job.motivation }).map((_, i) => (
                        <img key={i} src={heartIcon} className="inline-block mx-[2px]" />
                      ))}
                    </div>

                    <div className="mb-2">
                      <span className="font-semibold mr-2">Job URL:</span>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline break-all"
                      >
                        {truncateUrl(job.url)}
                      </a>
                    </div>

                    <div className="mb-2">
                      <span className="font-semibold mr-2">Status:</span>
                      <select
                        value={job.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(job.job_id, e.target.value)
                        }
                        className=" border py-1 rounded-lg text-center font-bold"
                        style={getStyles(job.status)}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="Resume Tailored">Resume Tailored</option>
                        <option value="Applied">Applied</option>
                        <option value="Followed-up">Followed-up</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="mb-2">
                      <span className="font-semibold mr-2">Applied Date:</span>
                      {formatDate(job.date_applied)}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-black py-1 px-3 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditJob(job);
                        }}
                      >
                        <img src={editIcon} />
                      </button>
                      <button
                        className="text-black py-1 px-3 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job.job_id);
                        }}
                      >
                        <img src={trashIcon} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* Off-Canvas for Job Details */}
            {showOffCanvas && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-end z-50">
                <div className="w-full sm:w-1/3 bg-white h-full pl-[75px] pr-[33px] pt-[37px] overflow-y-auto">
                  <div className="">
                    <div>
                      <X
                        className="ml-auto cursor-pointer"
                        onClick={handleClose}
                      />
                    </div>
                    {selectedJob ? (
                      <>
                        <h2 className="text-[32px] mb-[24px] font-bold">
                          {selectedJob.position}
                        </h2>
                        <div>
                          {selectedJob.status === "Not Started" ? (
                            <>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="mb-[16px]">My Task</p>
                                <span>Tailoring My Resume</span>
                              </div>
                              <div>
                                <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                  <p className="my-[16px]">Company</p>
                                  <span className="my-[16px]">
                                    {selectedJob.company_name}
                                  </span>
                                </div>
                                <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                  <p className="my-[16px] ">Job Interest</p>
                                  <div className="my-[16px] ">
                                    {Array.from({
                                      length: selectedJob.motivation || 0,
                                    }).map((_, index) => (
                                      <img
                                        key={index}
                                        src={heartIcon}
                                        className="inline-block mx-[2px]"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="my-[16px] ">Job URL</p>
                                <a
                                  href={selectedJob.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline my-[16px] "
                                >
                                  {selectedJob.url}
                                </a>
                              </div>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="my-[16px] ">Status</p>
                                <span className="my-[16px] ">
                                  {selectedJob.status}
                                </span>
                              </div>
                              <h3 className="font-bold mt-[32px] text-[19px]">
                                Remember what you learned in quest 3?
                              </h3>
                              <p className="text-[14px] mb-[24px]">
                                If not, visit the quest{" "}
                                <a href="" className="underline">
                                  here.
                                </a>
                              </p>
                              <ol className="list-decimal font-medium list-inside">
                                <p className="mb-[8px] ">
                                  Here's a short review to catch you up to
                                  speed:
                                </p>
                                <li className="mb-[16px]">
                                  Open ChatGPT and use the prompt:
                                  <br />
                                  "I’m applying for [Job Title] at [Company].
                                  Here’s my resume and the job description. Can
                                  you suggest how I can tailor my resume for
                                  this role to maximize my chances of landing an
                                  interview?"
                                  <br />
                                  Review ChatGPT’s suggestions and adjust your
                                  resume to match the job description, aligning
                                  experience, skills, and keywords.
                                </li>
                                <li>
                                  Edit the output as required to your
                                  preferences and then save the updated resume
                                  tailored for that specific job.
                                </li>
                              </ol>
                            </>
                          ) : selectedJob.status === "Resume Tailored" ? (
                            <>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="mb-[16px]">My Task</p>
                                <span>Apply For This Job</span>
                              </div>
                              <div>
                                <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                  <p className="my-[16px]">Company</p>
                                  <span className="my-[16px]">
                                    {selectedJob.company_name}
                                  </span>
                                </div>
                                <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                  <p className="my-[16px] ">Job Interest</p>
                                  <div className="my-[16px] ">
                                    {Array.from({
                                      length: selectedJob.motivation,
                                    }).map((_, index) => (
                                      <img
                                        key={index}
                                        src={heartIcon}
                                        className="inline-block mx-[2px]"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="my-[16px] ">Job URL</p>
                                <a
                                  href={selectedJob.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline my-[16px] "
                                >
                                  {selectedJob.url}
                                </a>
                              </div>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="my-[16px] ">Status</p>
                                <span className="my-[16px] ">
                                  {selectedJob.status}
                                </span>
                              </div>
                              <h3 className="font-bold mt-[32px] text-[19px]">
                                Remember what you learned in quest 4?
                              </h3>
                              <p className="text-[14px] mb-[24px]">
                                If not, visit the quest{" "}
                                <a href="" className="underline">
                                  here.
                                </a>
                              </p>
                              <ol className="list-decimal font-medium list-inside">
                                <p className="mb-[8px] ">
                                  Here's a short review to catch you up to
                                  speed:
                                </p>
                                <li className="mb-[16px]">
                                  Open your Job Follow-Up Board and sort by
                                  “Motivation Score” to focus on the
                                  highest-priority jobs. If jobs have the same
                                  motivation score, check for upcoming deadlines
                                  to decide which to prioritize first.
                                </li>
                                <li className="mb-[16px]">
                                  Check for approaching deadlines on
                                  high-motivation jobs. Make a note of upcoming
                                  deadlines for applications in the Notes
                                  section of the Edit Job or Add Job function
                                </li>
                                <li className="mb-[16px]">
                                  Submit your applications for jobs with high
                                  motivation scores and approaching deadlines.
                                  Double-check your tailored resume and cover
                                  letter before submitting.
                                </li>
                                <li className="mb-[16px]">
                                  Return to previous quests or continue to the
                                  next one once you’ve applied to your
                                  top-priority jobs. Maintain momentum by
                                  completing additional tasks in your job search
                                  plan!
                                </li>
                              </ol>
                            </>
                          ) : selectedJob.status === "Applied" ? (
                            <>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="mb-[16px]">My Task</p>
                                <span>
                                  Follow Up with Hiring Manager/Recruiter
                                </span>
                              </div>
                              <div>
                                <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                  <p className="my-[16px]">Company</p>
                                  <span className="my-[16px]">
                                    {selectedJob.company_name}
                                  </span>
                                </div>
                                <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                  <p className="my-[16px] ">Job Interest</p>
                                  <div className="my-[16px] ">
                                    {Array.from({
                                      length: selectedJob.motivation || 0,
                                    }).map((_, index) => (
                                      <img
                                        key={index}
                                        src={heartIcon}
                                        className="inline-block mx-[2px]"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="my-[16px] ">Job URL</p>
                                <a
                                  href={selectedJob.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline my-[16px] "
                                >
                                  {selectedJob.url}
                                </a>
                              </div>
                              <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                                <p className="my-[16px] ">Status</p>
                                <span className="my-[16px] ">
                                  {selectedJob.status}
                                </span>
                              </div>
                              <h3 className="font-bold mt-[32px] text-[19px]">
                                Remember what you learned in quest 5 and 6?
                              </h3>
                              <p className="text-[14px] mb-[24px]">
                                If not, visit the quest{" "}
                                <a href="" className="underline">
                                  here.
                                </a>
                              </p>
                              <ol className="list-decimal font-medium list-inside">
                                <p className="mb-[8px] ">
                                  Here's a short review to catch you up to
                                  speed:
                                </p>
                                <li className="mb-[16px]">
                                  Find recruiters or hiring managers on LinkedIn
                                  for jobs you’ve applied to.
                                </li>
                                <li className="mb-[16px]">
                                  Send personalized connection requests to
                                  recruiters or hiring managers.
                                </li>
                                <li className="mb-[16px]">
                                  Follow up after your connection request has
                                  been accepted to inquire about the next steps.
                                </li>
                                <li className="mb-[16px]">
                                  Check jobs from your Job Follow-Up Board that
                                  still haven’t received responses in 4 or more
                                  days after applying.
                                </li>
                                <li className="mb-[16px]">
                                  Send follow-up messages to recruiters for
                                  these jobs using ChatGPT to craft your
                                  message.
                                </li>
                                <li className="mb-[16px]">
                                  Update your Job Follow-Up Board to reflect
                                  that you’ve followed up on your applications.
                                </li>
                              </ol>
                            </>
                          ) : (
                            <span>No task for this status</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between border-b-[1.5px] border-[#A7B2BF] font-medium">
                          <p className="mb-[16px]">My Task</p>
                          <span>Find and Add Another Job</span>
                        </div>
                        <h3 className="font-bold mt-[32px] text-[19px]">
                          Remember what you learned in quest 1?
                        </h3>
                        <p className="text-[14px] mb-[24px]">
                          If not, visit the quest{" "}
                          <a href="" className="underline">
                            here.
                          </a>
                        </p>
                        <ol className="list-decimal font-medium list-inside">
                          <p className="mb-[8px] ">
                            Here's a short review to catch you up to speed:
                          </p>
                          <li className="mb-[16px]">
                            Search job boards like LinkedIn, Indeed, and company
                            websites.
                          </li>
                          <li className="mb-[16px]">
                            Use keywords like “Junior [Position]” or
                            “Entry-Level [Position]” and apply filters such as
                            “Remote” or “Entry-Level.”
                          </li>
                          <li className="mb-[16px]">
                            Select jobs that match your criteria and interests.
                          </li>
                          <li className="mb-[16px]">
                            Save the job listings by entering them into the Job
                            Follow-Up Board, including job title, company name,
                            and job listing URL.
                          </li>
                        </ol>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Dialog
        className="overflow-auto max-h-[70vh] p-[16px]"
        open={open}
        handler={handleOpenDialog} onResize={undefined} onResizeCapture={undefined}      >
        <DialogBody onResize={undefined} onResizeCapture={undefined}>
          <div className="mx-auto text-center">
            <div>
              <X
                className="ml-auto cursor-pointer"
                onClick={handleCloseDialog}
              />
            </div>
            <h2 className="text-4xl font-bold mb-6">Job Details</h2>
          </div>

          <div className="mb-[16px]">
            <p className="font-bold text-[22px] text-[#525962]">Job Details</p>
          </div>

          <div className="border-b-[1.5px] border-b-[#54545680] pb-[24px]">
            <div className="flex mx-auto mb-[16px]">
              <Pencil />
              <p className="ml-2 font-semibold text-[#3A3A3A]">Company Name</p>
              <form className="ml-auto">
                <input
                  type="text"
                  name="company_name"
                  placeholder="Full Name"
                  onChange={handleInput}
                  value={jobData.company_name}
                  className="text-center font-medium"
                  required
                />
              </form>
            </div>
            <div className="flex mx-auto mb-[16px]">
              <Pencil />
              <p className="ml-2 font-semibold text-[#3A3A3A]">Job Title</p>
              <input
                type="text"
                name="position"
                placeholder="Job Title"
                value={jobData.position}
                onChange={handleInput}
                className="font-medium text-center ml-auto"
                required
              />
            </div>
            <div className="flex mx-auto">
              <Pencil />
              <p className="ml-2 font-semibold text-[#3A3A3A]">Job Posting URL</p>
              <form className="ml-auto">
                <input
                  type="url"
                  name="url"
                  value={jobData.url}
                  onChange={handleInput}
                  placeholder="Enter URL"
                  className="text-center font-medium "
                  required
                />
              </form>
            </div>
          </div>

          <div className="mt-[24px] mb-[16px]">
            <h2 className="font-bold text-[22px] text-[#525962]">Follow-ups</h2>
          </div>

          <div className="border-b-[1.5px] border-b-[#54545680] pb-[24px]">
            <div className="flex mx-auto mb-[27px]">
              <Calendar />
              <p className="ml-2 font-semibold text-[#3A3A3A]">Applied Date</p>
              <form className="ml-auto">
                <input
                  type="date"
                  name="date_applied"
                  value={jobData.date_applied}
                  onChange={handleInput}
                  className="font-medium text-center"
                  required
                />
              </form>
            </div>
            <div className="flex mx-auto">
              <Hourglass />
              <p className="ml-2 font-semibold text-[#3A3A3A]">Follow-up Date</p>
              <form className="ml-auto">
                <input
                  type="date"
                  name="reminder_date"
                  value={jobData.reminder_date}
                  onChange={handleInput}
                  className="font-medium text-center"
                  required
                />
              </form>
            </div>
          </div>

          <div className="mb-[16px] mt-[24px] flex items-center">
            <h2 className="font-bold text-[22px] text-[#525962]">
              Job Interest
            </h2>
            <Info className="text-center ml-2 mt-2" />
          </div>

          <div className="border-b-[1.5px] border-b-[#54545680] pb-[24px] ">
            <div className="flex">
              <HandHeart />
              <p className="ml-2 font-semibold text-[#3A3A3A]">Motivational Value</p>
              <div className="ml-auto mr-[30px] flex flex-wrap">
                {[1, 2, 3, 4, 5].map(heartValue => (
                  <img
                    key={heartValue}
                    src={
                      jobData.motivation >= heartValue
                        ? heartIcon
                        : emptyHeartIcon
                    } // Use a different icon for unselected hearts
                    className="text-center ml-[8px] cursor-pointer"
                    onClick={() => handleMotivation(heartValue)}
                    alt="heart icon"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <h2 className="font-bold text-[22px] text-[#525962] mt-[24px] mb-[16px] ">
              Contacts & Networking
            </h2>
          </div>

          <div className="p-2">
            <div className="flex mx-auto">
              <Pencil />
              <p className="ml-2 font-semibold text-[#3A3A3A]">Recruiter</p>
              <form className="ml-auto flex flex-col mb-2">
                <input
                  type="text"
                  name="recruiterName"
                  value={jobData.recruiter?.name}
                  onChange={handleInput}
                  placeholder="Name of Recruiter"
                  className="mb-2 font-medium text-center rounded-md"
                />
                <input
                  type="url"
                  name="recruiterUrl"
                  value={jobData.recruiter?.url}
                  onChange={handleInput}
                  placeholder="Linkedin URL"
                  className="font-medium text-center rounded-md"
                />
              </form>
            </div>
            <div className="flex py-[24px] mx-auto border-b-[1.5px] border-b-[#54545680]">
              <Pencil />
              <p className="ml-2 font-medium text-[#3A3A3A]">Hiring Manager</p>
              <form className="ml-auto flex flex-col">
                <input
                  type="text"
                  name="hiringManagerName"
                  value={jobData.hiring_manager?.name}
                  onChange={handleInput}
                  placeholder="Name of Hiring Manager"
                  className="mb-2 font-medium text-center rounded-md"
                />
                <input
                  type="url"
                  name="hiringManagerUrl"
                  value={jobData.hiring_manager?.url}
                  onChange={handleInput}
                  placeholder="Linkedin URL"
                  className="font-medium text-center rounded-md"
                />
              </form>
            </div>
            <div className="">
              <h2 className="ml-9 mt-[24px] font-medium text-[#3A3A3A]">
                Comment
              </h2>
              <form className="ml-auto flex flex-col">
                <input
                  type="text"
                  name="notes"
                  value={jobData.notes}
                  onChange={handleInput}
                  placeholder="Enter Comment"
                  className="mb-2 font-medium text-center rounded-md"
                />
              </form>
            </div>
          </div>

          <div>
            <Button
              onClick={isEditing ? updateJob : saveJob}
              className="py-[12px] px-[16px] bg-[#007AFF] hover:bg-opacity-[36%] text-white text-[15px] font-bold mx-auto text-center mt-[24px] w-full rounded-lg"
              variant={"text"}
              style={{ textTransform: "none" }} onResize={undefined} onResizeCapture={undefined}            >
              {isEditing ? "Update Job" : "Add Job"}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default React.memo(JobTracking);
