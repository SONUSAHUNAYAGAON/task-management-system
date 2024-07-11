import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import CreateTask from "./components/CreateTask";
import ViewTaskDetails from "./components/ViewTaskDetails";
import EditTask from "./components/EditTask";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-task" element={<CreateTask />} />
        <Route path="/task/view/details" element={<ViewTaskDetails />} />
        <Route path="/edit/task" element={<EditTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
