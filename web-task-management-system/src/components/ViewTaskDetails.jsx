import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewTaskDetails = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;
  const [singleTask, setSingleTask] = useState("");
  // if(not token then redirect to login page)
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);
  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const taskId = urlParams.get("taskId");
  console.log(taskId);

  // call this fetch task data in useEffect
  useEffect(() => {
    // fetch One task data
    const getOneTaskData = async () => {
      try {
        if (token) {
          const response = await axios.get(
            `http://localhost:5000/api/task/${taskId}`,
            {
              headers: {
                Authorization: `JWT ${token}`,
              },
            }
          );
          console.log(response, "response");
          setSingleTask(response.data);
        }
      } catch (error) {
        console.error("Error get one task:", error);
      }
    };
    getOneTaskData();
  }, [token, navigate]);

  //   time zone convert
  const formateTaskData = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour12: true,
    };

    const taskDate = new Date(dateString);
    const formattedDate = taskDate.toLocaleString("en-GB", options);

    return formattedDate;
  };
  return (
    <>
      <main>
        <div className="text-black p-4 w-full mb-4 rounded shadow flex justify-between navbar navbar-expand-lg navbar-light bg-light items-center">
          <h1 className="text-xl font-bold text-black">Magnet Brains</h1>
          <div>
            <span className="mx-2 my-1">{currentUser?.userName}</span>
            <button
              className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded"
              onClick={handleLogout} // Wire up logout functionality
            >
              Logout
            </button>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="mb-4 sm:mb-1">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold dark:text-white">
              Task Details ✨
            </h1>
          </div>
          {/* Cards */}
          <div className="grid  bg-white h-1/2   mt-5 shadow-lg rounded-sm border border-slate-200  dark:bg-gray-800 dark:border-gray-700">
            <div className="mx-5 my-5">
              <div
                className="btn bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                onClick={() => navigate(-1)}
              >
                &lt;- Back
              </div>
            </div>
            <form>
              {
                <>
                  {/* description */}
                  <div className="md:grid grid-cols-1 block py-1 ml-5 ">
                    <div className="md:py-0 py-2 md:block grid ">
                      <span className="block text-sm font-medium mb-1">
                        Description <span className="text-rose-500">*</span>
                      </span>
                      <div className="py-2">
                        <div className="w-4/5 py-2 rounded focus:outline-none focus:border-blue-500 form-input placeholder-gray-400 ">
                          {singleTask?.description}
                        </div>
                      </div>
                    </div>
                    <div className="md:py-0 py-2 md:block grid ">
                      <span className="block text-sm font-medium mb-1">
                        Due Date <span className="text-rose-500">*</span>
                      </span>
                      <div className="py-1">
                        <div className="w-4/5 py-2 rounded focus:outline-none focus:border-blue-500 form-input placeholder-gray-400 ">
                          {formateTaskData(singleTask.dueDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default ViewTaskDetails;
