import React, { useContext, useState } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";

const EditProfile = () => {
  const userCtx = useContext(UserContext);
  const [username, setUsername] = useState(
    userCtx.userProfile.serialized_profile.fields.name
  );
  const [bio, setBio] = useState(
    userCtx.userProfile.serialized_profile.fields.bio
  );
  const [location, setLocation] = useState(
    userCtx.userProfile.serialized_profile.fields.location
  );
  const [website, setWebsite] = useState(
    userCtx.userProfile.serialized_profile.fields.website
  );
  const [profilePic, setProfilePic] = useState(
    userCtx.userProfile.serialized_profile.fields.profile_img
  );
  const [bannerPic, setBannerPic] = useState(
    userCtx.userProfile.serialized_profile.fields.banner_img
  );

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleBio = (e) => {
    setBio(e.target.value);
  };
  const handleLocation = (e) => {
    setLocation(e.target.value);
  };
  const handleWebsite = (e) => {
    setWebsite(e.target.value);
  };
  const handleProfilePic = (e) => {
    setProfilePic(e.target.files[0]);
  };
  const handleBannerPic = (e) => {
    setBannerPic(e.target.files[0]);
  };

  let history = useHistory();
  const handleSavedChanges = async (e) => {
    let formData = new FormData();
    formData.append(
      "id",
      `${userCtx.userProfile.serialized_profile.fields.user}`
    );
    formData.append(
      "handle",
      `${userCtx.userProfile.serialized_profile.fields.handle}`
    );
    if (username && username.length > 15) {
      return alert("Username character limit exceeded");
    }
    if (username !== userCtx.userProfile.serialized_profile.fields.name) {
      formData.append("name", username);
    }
    if (bio && bio.length > 160) {
      return alert("Bio character limit exceeded");
    }
    if (bio !== userCtx.userProfile.serialized_profile.fields.bio) {
      formData.append("bio", bio);
    }
    if (location && location.length > 30) {
      return alert("Location character limit exceeded");
    }
    if (location !== userCtx.userProfile.serialized_profile.fields.location) {
      formData.append("location", location);
    }
    if (website && website.length > 30) {
      return alert("Website character limit exceeded");
    }
    if (website !== userCtx.userProfile.serialized_profile.fields.website) {
      formData.append("website", website);
    }
    if (
      profilePic !== userCtx.userProfile.serialized_profile.fields.profile_img
    ) {
      formData.append("profile_img", profilePic);
    }
    if (
      bannerPic !== userCtx.userProfile.serialized_profile.fields.banner_img
    ) {
      formData.append("banner_img", bannerPic);
    }

    const res = await fetch("http://localhost:8000/api/profile_update/", {
      method: "PATCH",
      body: formData,
    });
    const fetchedPatchResult = await res.json();
    const res2 = await fetch(
      `http://localhost:8000/api/profile/${userCtx.userProfile.serialized_profile.fields.handle}/`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: userCtx.userProfile.serialized_profile.fields.handle,
        }),
      }
    );
    const fetchedProfileData = await res2.json();
    userCtx.setUserProfile(fetchedProfileData);
    history.goBack();
    return fetchedProfileData;
  };
  return (
    <div>
      <div className="d-flex border-bottom align-items-center justify-content-between px-3">
        <div className="d-flex">
          <Link to="/Profile" className="d-flex align-items-center text-dark">
            <ArrowBackOutlinedIcon />
          </Link>
          <h5 className="py-2 sticky-top bg-white m-0 px-3">Edit Profile</h5>
        </div>
        <button
          className="btn btn-dark btn-sm rounded-pill m-2"
          onClick={handleSavedChanges}
        >
          <h6 className="p-0 m-0">Save</h6>
        </button>
      </div>

      <div className="d-flex flex-column align-items-center">
        <div className="form-group d-flex align-items-center justify-content-center w-100 m-4">
          <label className="w-25" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            className="form-control w-50"
            placeholder={userCtx.userProfile.serialized_profile.fields.name}
            id="username"
            onChange={handleUsername}
          />
        </div>
        <div className="form-group d-flex align-items-center justify-content-center w-100">
          <label className="w-25 mb-5" htmlFor="bio">
            Bio
          </label>
          <textarea
            placeholder={
              userCtx.userProfile.serialized_profile.fields.bio || "Bio"
            }
            className="form-control w-50"
            rows="3"
            id="bio"
            onChange={handleBio}
          />
        </div>
        <div className="form-group d-flex align-items-center justify-content-center w-100 m-4">
          <label className="w-25" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            className="form-control w-50"
            placeholder={
              userCtx.userProfile.serialized_profile.fields.location ||
              "Location"
            }
            id="location"
            onChange={handleLocation}
          />
        </div>
        <div className="form-group d-flex align-items-center justify-content-center w-100">
          <label className="w-25" htmlFor="website">
            Website
          </label>
          <input
            type="text"
            className="form-control w-50"
            placeholder={
              userCtx.userProfile.serialized_profile.fields.website || "Website"
            }
            id="website"
            onChange={handleWebsite}
          />
        </div>
        <div className="form-group d-flex align-items-center justify-content-center w-100 m-4">
          <label className="w-25" htmlFor="profilePic">
            Profile picture
          </label>
          <input
            className="form-control w-50"
            id="profilePic"
            type="file"
            onChange={handleProfilePic}
          />
        </div>
        <div className="form-group d-flex align-items-center justify-content-center w-100">
          <label className="w-25" htmlFor="bannerPic">
            Banner picture
          </label>
          <input
            className="form-control w-50"
            id="bannerPic"
            type="file"
            onChange={handleBannerPic}
          />
        </div>
        <div className="d-flex align-items-center justify-content-center w-100 m-5">
          <Link
            to="/Profile_Delete"
            className="btn btn-danger btn-sm rounded-pill w-25 mx-3"
          >
            <h6 className="p-0 m-0">Delete account</h6>
          </Link>
          <button className="btn btn-dark btn-sm rounded-pill w-25 mx-3">
            <h6 className="p-0 m-0" onClick={handleSavedChanges}>
              Save
            </h6>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
