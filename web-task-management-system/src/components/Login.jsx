import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // get token for login user if not token then redirect to login page
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/");
    }else {
      navigate("/home");
    }
  }, [navigate, token]);

  // handle user login
  const handleLogin = async () => {
    console.log(email, password);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/signin",
        {
          email,
          password,
        }
      );
      if (response.status === 201) {
        localStorage.setItem("token", response?.data?.token);
        navigate("/home");
        toast.success("user login successfully");
      } else {
        toast.error("Credentials do not match");
      }
    } catch (error) {
      toast.error("Credentials do not match");
    }
  };

  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card bg-dark text-white"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-5 text-center">
                  <div className="mb-md-5 mt-md-4 pb-3">
                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                    <p className="text-white-50 mb-5">Welcome!!!</p>
                    <div className="form-outline form-white mb-4">
                      <label
                        className="form-label d-flex justify-content-start"
                        htmlFor="typeEmailX"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-outline form-white mb-4">
                      <label
                        className="form-label d-flex justify-content-start"
                        htmlFor="typePasswordX"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn bg-indigo-400 hover:bg-indigo-600 btn-lg px-5"
                      onClick={handleLogin} // Call handleLogin on button click
                    >
                      Login
                    </button>
                  </div>
                  <div>
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <button
                        className="text-indigo-400"
                        onClick={() => navigate("/signup")} // Correct usage of navigate in click handler
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
