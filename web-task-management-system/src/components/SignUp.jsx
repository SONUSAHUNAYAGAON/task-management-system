import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        { email, password, userName }
      );
      if (response.status === 201) {
        navigate("/");
        toast.success("user created successfully");
      } else {
        toast.error("something went wrong");
      }
      setEmail("");
      setPassword("");
      setUserName("");
    } catch (error) {}
  };
  return (
    <>
      <section className="text-center">
        {/* Background image */}
        <div
          className="p-5 bg-image"
          style={{
            backgroundImage:
              'url("https://mdbootstrap.com/img/new/textures/full/171.jpg")',
            height: "300px",
          }}
        />
        {/* Background image */}
        <div
          className="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary"
          style={{ marginTop: "-100px", backdropFilter: "blur(30px)" }}
        >
          <div className="card-body py-5 px-md-5">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-8">
                <h2 className="fw-bold mb-5 text-left">Sign up now</h2>
                <form onSubmit={handleSubmit}>
                  {/* User Name */}
                  <div className="form-outline mb-4">
                    <label
                      className="form-label d-flex justify-content-start"
                      htmlFor="username"
                    >
                      Username
                    </label>

                    <input
                      type="text"
                      id="username"
                      className="form-control form-control-lg"
                      value={userName}
                      placeholder="username..."
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  {/* Email input */}
                  <div className="form-outline mb-4">
                    <label
                      className="form-label d-flex justify-content-start "
                      htmlFor="form3Example3"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="form3Example3"
                      className="form-control form-control-lg"
                      placeholder="abc@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {/* Password input */}
                  <div className="form-outline mb-4">
                    <label
                      className="form-label d-flex justify-content-start"
                      htmlFor="form3Example4"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="form3Example4"
                      className="form-control form-control-lg"
                      placeholder="**********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                  >
                    Sign up
                  </button>
                  <span>
                    Already have an Account{" "}
                    <button
                      onClick={() => navigate("/")}
                      className="text-blue-500"
                    >
                      Login{" "}
                    </button>
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
