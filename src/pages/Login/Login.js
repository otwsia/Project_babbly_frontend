import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const userCtx = useContext(UserContext);

  const handleEmail = async (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = async (e) => {
    setPassword(e.target.value);
  };

  let history = useHistory();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Missing inputs");
    }
    try {
      const res = await fetch(
        "https://projectbabblybackend-production.up.railway.app/jwt-api/login/",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      const fetchedLogin = await res.json();
      if (!fetchedLogin["access"]) {
        return alert("Incorrect login details");
      }
    } catch (err) {
      return alert("Incorrect login details");
    }
    const res2 = await fetch(
      "https://projectbabblybackend-production.up.railway.app/api/get-user/",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email,
          name: null,
          handle: null,
        }),
      }
    );
    const fetchedUserData = await res2.json();
    const userHandle = fetchedUserData[0]["fields"]["handle"];

    const res3 = await fetch(
      `https://projectbabblybackend-production.up.railway.app/api/profile/${userHandle}/`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: userHandle,
        }),
      }
    );
    const fetchedProfileData = await res3.json();
    userCtx.setUserProfile(fetchedProfileData);

    history.push("/");
    return fetchedProfileData;
  };
  return (
    <div>
      <h5 className="py-2 px-3 border-bottom">Login</h5>
      <div className="d-flex flex-column align-items-center">
        <h1>
          {" "}
          Sign in to <span className="text-info">Babbly</span>
        </h1>
        <input
          type="email"
          className="form-control w-50 m-3"
          placeholder="Email"
          onChange={handleEmail}
        />
        <input
          type="password"
          className="form-control w-50 m-3"
          placeholder="Password"
          onChange={handlePassword}
        />
        <button
          type="submit"
          class="btn btn-dark w-50 rounded-pill m-3"
          onClick={handleLogin}
        >
          Submit
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/Sign_up" className="link-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
