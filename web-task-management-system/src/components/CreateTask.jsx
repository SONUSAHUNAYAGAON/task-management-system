import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState(""); // State for due date
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = token ? jwtDecode(token) : null;
  console.log(currentUser);

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

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !priority || !dueDate) {
      return toast.error("Please fill all fields");
    }
    const formData = {
      title,
      description,
      priority,
      dueDate, // Include due date in form data
    };
    console.log(formData);

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:5000/api/task",
        formData,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      if (response.status === 201) {
        navigate("/home");
        toast.success("task created successfully");
      } else {
        toast.error("something went wrong");
      }

      // Reset form fields
      setTitle("");
      setDescription("");
      setPriority("");
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
            onClick={handleLogout} // Wire up logout functionality
          >
            Logout
          </button>
        </div>
      </div>
      <div className="container my-5">
        <div className="flex justify-between ">
          {" "}
          <h1 className="font-bold text-lg mx-4 border-b text-black border-black mb-1">
            Add Task
          </h1>{" "}
          <button
            className="btn bg-indigo-600 mx-2 text-white hover:bg-indigo-700"
            onClick={() => navigate("/home")}
          >
            All Task
          </button>
        </div>

        <div className="flex justify-center items-center h-screen">
          <form onSubmit={handleSubmit} className="container mx-auto max-w-md">
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
              <label htmlFor="priority">Priority</label>
              <select
                className="form-control w-full"
                id="priority"
                value={priority}
                onChange={handlePriorityChange}
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                className="form-control w-full"
                id="dueDate"
                value={dueDate}
                onChange={handleDueDateChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTask;
