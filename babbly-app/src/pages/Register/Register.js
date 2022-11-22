import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState(null);
  const [handle, setHandle] = useState(null);
  const [email, setEmail] = useState(null);
  const [password1, setPassword1] = useState(null);
  const [password2, setPassword2] = useState(null);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleHandle = (e) => {
    setHandle(e.target.value);
  };
  const handlePassword1 = (e) => {
    setPassword1(e.target.value);
  };
  const handlePassword2 = (e) => {
    setPassword2(e.target.value);
  };

  let history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !handle || !username || !password1 || !password2) {
      return alert("Missing input");
    } else if (password1 !== password2) {
      return alert("Password inputs do not match");
    } else if (email.length > 60) {
      return alert("Email cannot be more than 60 characters");
    } else if (username.length > 15) {
      return alert("Username cannot be more than 15 characters");
    } else if (handle.length > 15) {
      return alert("Handle cannot be more than 15 characters");
    }
    const result = await fetch("http://localhost:8000/api/get-user/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: email,
        handle: handle,
        name: username,
      }),
    });
    const currentUser = await result.json();
    for (let items of currentUser) {
      if (items["fields"]["email"] === email) {
        return alert("Email has already been registered");
      } else if (items["fields"]["handle"] === handle) {
        return alert("Handle already in use");
      } else if (items["fields"]["name"] === username) {
        return alert("Username already in use");
      }
    }
    const res = await fetch("http://localhost:8000/api/register/", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: email,
        handle: handle,
        password: password1,
        name: username,
      }),
    });
    const registeredUser = await res.json();
    history.push("/Successful_Registration");
    return registeredUser;
  };

  return (
    <div>
      <h5 className="py-2 px-3 border-bottom">Registration</h5>
      <div className="d-flex flex-column align-items-center">
        <h1>
          {" "}
          Join <span className="text-info">Babbly</span> today
        </h1>
        <div className="w-75 px-3">
          <input
            type="email"
            className="form-control w-100 my-3"
            placeholder="Email"
            onChange={handleEmail}
          />
        </div>

        <div className="d-flex w-75">
          <input
            type="text"
            className="form-control w-50 m-3"
            placeholder="Username"
            onChange={handleUsername}
          />
          <input
            type="text"
            className="form-control w-50 m-3"
            placeholder="@ Handle"
            onChange={handleHandle}
          />
        </div>
        <div className="d-flex w-75">
          <input
            type="password"
            className="form-control w-50 m-3"
            placeholder="Password"
            onChange={handlePassword1}
          />
          <input
            type="password"
            className="form-control w-50 m-3"
            placeholder="Confirm password"
            onChange={handlePassword2}
          />
        </div>

        <button
          type="submit"
          className="btn btn-dark w-50 rounded-pill m-3"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <p>
          Already have an account?{" "}
          <Link to="/Login" className="link-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
