import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import UserContext from "../../context/UserContext";

const DeleteProfile = () => {
  const userCtx = useContext(UserContext);
  let history = useHistory();

  const handleDeleteAcc = async () => {
    const res = await fetch(
      "https://projectbabblybackend-production.up.railway.app/api/profile_delete/",
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: `${userCtx.userProfile.serialized_profile.fields.user}`,
        }),
      }
    );
    const fetchedPostData = await res.json();
    userCtx.setUserProfile(null);
    history.push("/");
    return fetchedPostData;
  };
  return (
    <div>
      <div className="d-flex border-bottom align-items-center px-3">
        <Link
          to="/Profile_Edit"
          className="d-flex align-items-center text-dark"
        >
          <ArrowBackOutlinedIcon />
        </Link>
        <h5 className="py-2 sticky-top bg-white m-0 px-3">Delete Profile</h5>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center w-100 m-2">
        <h1>Are you sure?</h1>
        <div className="text-danger m-2">
          <ReportProblemOutlinedIcon sx={{ fontSize: "100px" }} />
        </div>
        <div className="m-2">
          <p className="p-0 m-0">
            Are you sure you want to delete your account?
          </p>
          <p className="p-0 m-0">This will permanently erase your account.</p>
        </div>
        <div className="d-flex align-items-center justify-content-center w-100 m-4">
          <button
            to="/Profile_Delete"
            className="btn btn-danger btn-sm rounded-pill w-25 mx-3"
            onClick={handleDeleteAcc}
          >
            <h6 className="p-0 m-0">Delete</h6>
          </button>
          <Link
            to="/Profile_Edit"
            className="btn btn-dark btn-sm rounded-pill w-25 mx-3"
          >
            <h6 className="p-0 m-0">Cancel</h6>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
