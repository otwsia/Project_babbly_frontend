import React from "react";
import { Link } from "react-router-dom";

const Authentication = () => {
  return (
    <div className="border border-muted rounded my-2 p-2">
      <h4>New to Babbly?</h4>
      <p className="p-0 m-0">
        Sign up to get your own personalized timeline today!
      </p>
      <Link to="/Sign_up" className="btn btn-info rounded-pill w-100 my-2">
        <p className="p-0 m-0 text-white">Sign up</p>
      </Link>
      <p className="p-0 m-0">
        Already a user?{" "}
        <Link to="/Login" className="link-primary">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Authentication;
