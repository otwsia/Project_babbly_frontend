import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import defaultProfilePic from "./blank-profile-picture.png";
import logo from "./Babbly.png";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UserContext from "../../context/UserContext";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { Button } from "@mui/material";

const Navbar = () => {
  const [post, setPost] = useState("");
  const userCtx = useContext(UserContext);
  const [postPic, setPostPic] = useState(null);

  const handleInput = (e) => {
    setPost(e.target.value);
  };

  const handlePostPic = (e) => {
    setPostPic(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (post.length > 160) {
      return alert("Alert: Input character limit exceeded");
    }
    if (post.length === 0) {
      return alert("Alert: No input");
    }
    let formData = new FormData();
    formData.append(
      "user",
      `${userCtx.userProfile.serialized_profile.fields.handle}`
    );
    formData.append("caption", `${post}`);
    formData.append(
      "name",
      `${userCtx.userProfile.serialized_profile.fields.name}`
    );
    formData.append(
      "profile_img",
      `${userCtx.userProfile.serialized_profile.fields.profile_img}`
    );
    if (postPic) {
      formData.append("image", postPic);
    }
    const res = await fetch(
      "https://projectbabblybackend-production.up.railway.app/post/upload/",
      {
        method: "PUT",
        body: formData,
      }
    );
    const fetchedResult = await res.json();
    setPost("");
    let timestamp = new Date();
    userCtx.setBabbleRefresh(post + timestamp.toString());
    return fetchedResult;
  };

  let history = useHistory();
  const handleLogout = () => {
    userCtx.setUserProfile(null);
    userCtx.setViewedProfile(null);
    userCtx.setBabbleRefresh(null);
    history.push("/");
  };

  return (
    <div className="w-25 mx-3 d-flex flex-column justify-content-between">
      <nav>
        <div className="w-50 mx-2">
          <img src={logo} alt="babbly-logo" className="img-fluid my-2" />
        </div>
        {/* Links */}

        <div className="mx-2 mb-4">
          {userCtx.userProfile &&
            userCtx.userProfile.serialized_profile.fields.handle !==
              "admin" && (
              <Link
                to="/Home"
                className="text-dark d-flex align-items-center text-decoration-none mb-3"
              >
                <HomeRoundedIcon fontSize="large" />
                <h5 className="p-0 mx-3 my-0">Home</h5>
              </Link>
            )}
          <Link
            to="/"
            className="text-dark d-flex align-items-center text-decoration-none mb-3"
          >
            <ExploreRoundedIcon fontSize="large" />
            <h5 className="p-0 mx-3 my-0">Explore</h5>
          </Link>
          {userCtx.userProfile &&
            userCtx.userProfile.serialized_profile.fields.handle !==
              "admin" && (
              <Link
                to="/Profile"
                className="text-dark d-flex align-items-center text-decoration-none"
              >
                <AccountCircleRoundedIcon fontSize="large" />
                <h5 className="p-0 mx-3 my-0">Profile</h5>
              </Link>
            )}
        </div>

        {/* Post portion */}
        {userCtx.userProfile &&
          userCtx.userProfile.serialized_profile.fields.handle !== "admin" && (
            <button
              type="button"
              className="btn btn-info rounded-pill w-100"
              data-bs-toggle="modal"
              data-bs-target="#BabbleModal"
            >
              <h6 className="p-0 my-1 text-white">Babble</h6>
            </button>
          )}
      </nav>

      {/* Post Modal */}
      <div
        className="modal fade"
        id="BabbleModal"
        tabindex="-1"
        aria-labelledby="babbleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="babbleModalLabel">
                Babble
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row gx-1">
                <div className="col-1 jumbotron">
                  <div className="ratio ratio-1x1">
                    <img
                      src={
                        userCtx.userProfile
                          ? `https://projectbabblybackend-production.up.railway.app/media/${userCtx.userProfile.serialized_profile.fields.profile_img}`
                          : defaultProfilePic
                      }
                      alt="profile-pic"
                      className="img-fluid rounded-circle ratio ratio-1x1"
                    />
                  </div>
                </div>
                <div className="col-11">
                  <textarea
                    placeholder="What's happening?"
                    className="border-0 rounded-0 form-control shadow-none p-2"
                    rows="4"
                    onChange={handleInput}
                    value={post}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <div className="w-50 mx-2 my-0 p-0">
                <Button
                  variant="outlined"
                  color="primary"
                  component="label"
                  className="border text-dark rounded-pill h-75"
                >
                  <AddAPhotoOutlinedIcon />
                  <p className="pt-1 pb-0 px-1 m-0">pics</p>
                  <input type="file" onChange={handlePostPic} hidden />
                </Button>
              </div>

              <button
                className="btn btn-info rounded-pill w-25"
                onClick={handleSubmit}
                data-bs-dismiss="modal"
              >
                <h6 className="m-0 p-0 text-white">Babble</h6>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile portion */}
      {userCtx.userProfile && (
        <div className="d-flex mb-4 justify-content-between align-items-center">
          <div className="w-75 d-flex align-items-center">
            <div className="w-25 jumbotron">
              <div className="w-75 ratio ratio-1x1">
                <img
                  src={`https://projectbabblybackend-production.up.railway.app/media/${userCtx.userProfile.serialized_profile.fields.profile_img}`}
                  alt="profile-pic"
                  className="img-fluid rounded-circle ratio ratio-1x1"
                />
              </div>
            </div>
            <div className="d-flex flex-column">
              <h6 className="p-0 mb-1 mx-3">
                {userCtx.userProfile.serialized_profile.fields.name}
              </h6>
              <h6 className="p-0 my-0 text-muted mx-3">
                @{userCtx.userProfile.serialized_profile.fields.handle}
              </h6>
            </div>
          </div>
          <button
            type="button"
            className="btn border-0 btn-sm h-50 d-flex align-self-start my-1"
            data-bs-toggle="modal"
            data-bs-target="#LogoutModal"
          >
            <ExitToAppIcon />
          </button>
        </div>
      )}

      {/* Logout modal */}
      <div className="modal" tabindex="-1" id="LogoutModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Logout</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you would like to logout?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm rounded-pill"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-pill"
                onClick={handleLogout}
                data-bs-dismiss="modal"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
