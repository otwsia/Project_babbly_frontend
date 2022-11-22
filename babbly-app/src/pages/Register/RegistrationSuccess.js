import React from "react";
import { Link } from "react-router-dom";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const RegistrationSuccess = () => {
  return (
    <div>
      <h5 className="py-2 px-3 border-bottom">Registration</h5>
      <div className="d-flex flex-column align-items-center">
        <h1>Success!</h1>
        <CheckCircleOutlineOutlinedIcon
          sx={{ fontSize: "80px" }}
          className="text-info mb-2"
        />
        <p className="w-50 text-center">
          Congratulations, your account has been successfully created.
        </p>
        <Link className="btn btn-dark w-50 rounded-pill m-3" to="/Login">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
