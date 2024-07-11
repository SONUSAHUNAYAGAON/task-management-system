import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // State for due date
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const taskId = urlParams.get("taskId");
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };
  // call this fetch task data in useEffect
  useEffect(() => {
    // fetch One task data for update
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
          setDescription(response?.data?.description);
          setTitle(response?.data?.title);
          const formattedDueDate = new Date(response?.data?.dueDate)
            .toISOString()
            .split("T")[0];
          setDueDate(formattedDueDate);
        }
      } catch (error) {
        console.error("Error get one task:", error);
      }
    };
    getOneTaskData();
  }, [token, navigate, taskId]);

  const handleUpdateTast = async () => {
    if (!title || !description || !dueDate) {
      return toast.error("Please fill all fields");
    }
    const formData = {
      title,
      description,
      dueDate, // Include due date in form data
    };

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.patch(
        `http://localhost:5000/api/task/${taskId}`,
        formData,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        navigate("/home");
        toast.success("task updated successfully");
      } else {
        toast.error("something went wrong");
      }

      // Reset form fields
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.error("Failed to add task", error);
      // Handle error appropriately
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
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="container my-5">
        <div className="flex justify-between ">
          {" "}
          <h1 className="font-bold text-lg mx-4 border-b text-black border-black mb-1">
            Edit Task
          </h1>{" "}
          <button
            className="btn bg-indigo-600 mx-2 text-white hover:bg-indigo-700"
            onClick={() => navigate("/home")}
          >
            All Task
          </button>
        </div>

        <div className="flex justify-center items-center h-screen">
          <div className="container mx-auto max-w-md">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control w-full"
                id="title"
                aria-describedby="titleHelp"
                placeholder="Enter Title..."
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                className="form-control w-full"
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                className="form-control w-full"
                id="dueDate"
                value={dueDate ? dueDate.slice(0, 16) : ""}
                onChange={handleDueDateChange}
              />
            </div>

            <button
              onClick={() => handleUpdateTast()}
              className="btn btn-primary w-full mt-4"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTask;
