import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;
  const [taskData, setTaskData] = useState([]);
  const [statusOptions] = useState(["Pending", "Completed"]);

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

  // fetch all task data
  const getAllTaskData = async () => {
    try {
      if (token) {
        const response = await axios.get("http://localhost:5000/api/task", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setTaskData(response.data);
      }
    } catch (error) {
      console.error("Error get all tasks:", error);
    }
  };
  // call this fetch task data in useEffect
  useEffect(() => {
    getAllTaskData();
  }, [token, navigate]);

  // handle delete
  const handleDelete = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/task/${taskId}`,
            {
              headers: {
                Authorization: `JWT ${token}`,
              },
            }
          );
       
            //  call for latest data
            getAllTaskData();

            Swal.fire("Deleted!", "The Task has been deleted.", "success");
      
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire("Error!", "Failed to delete the task.", "error");
        }
      }
    });
  };
  const itemsPerPage = [5];

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(taskData?.length / itemsPerPage[0]);

  const startIndex = (currentPage - 1) * itemsPerPage[0];
  const endIndex = startIndex + itemsPerPage[0];

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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

  // Handle status change for a task
  const handleStatusChange = async (taskId, newStatus) => {
    console.log(taskId, newStatus);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/task/${taskId}/update-status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      getAllTaskData();
      Swal.fire("Updated!", "Task status has been updated.", "success");
    } catch (error) {
      console.error("Error updating task status:", error);
      Swal.fire("Error!", "Failed to update task status.", "error");
    }
  };

  return (
    <>
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
      <div className="w-full mb-4 rounded  flex justify-between items-center ">
        <h1 className="text-xl font-bold text-white">{""}</h1>
        <button onClick={() => navigate("/add-task")}>
          <button className="font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded mr-3">
            Add Task
          </button>
        </button>
      </div>
      {/* show all task specific user */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-indigo-500 text-white">
            <tr className="text-left">
              <th className="px-4 py-2">S.No</th>
              <th className=" px-4 py-2">Title</th>

              <th className=" px-4 py-2">Due Date</th>

              <th className=" px-4 py-2">Status</th>
              <th className=" px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {taskData?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <strong className="font-bold">No tasks found!</strong>
                    <span className="block sm:inline">
                      Create a task to get started.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              taskData?.slice(startIndex, endIndex)?.map((task, index) => (
                <tr key={task._id} className="text-left border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className=" px-2 py-2">{task.title}</td>

                  <td className=" px-2 py-2">
                    {formateTaskData(task.dueDate)}
                  </td>

                  <td className="px-4 py-2">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className="form-control"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className=" px-4 py-2 flex">
                    <button
                      onClick={() => navigate(`/edit/task?taskId=${task?._id}`)}
                      className="btn bg-blue-500 hover:bg-indigo-600 text-white mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task?._id)} // Ensure task._id is defined here
                      className="btn bg-red-500 hover:bg-red-600 text-white mr-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/task/view/details?taskId=${task?._id}`)
                      }
                      className="btn bg-yellow-500 hover:bg-yellow-600 text-white mr-2"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/*Pagination previous and Next Button  */}
        <div className="flex justify-end mt-6">
          {currentPage > 1 && (
            <button
              className="inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-indigo-600 hover:bg-indigo-700 border border-slate-200 text-white hover:text-slate-200 shadow-sm mx-1"
              onClick={handlePreviousPage}
            >
              Previous
            </button>
          )}

          {currentPage < totalPages && (
            <button
              className="inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-indigo-600 hover:bg-indigo-700 border border-slate-200 text-white hover:text-slate-200 shadow-sm mx-1"
              onClick={handleNextPage}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
