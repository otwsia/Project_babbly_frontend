import React, { useContext, useState } from "react";
import UserContext from "../../../context/UserContext";

import { Button } from "@mui/material";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";

const PagePost = (props) => {
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
    const res = await fetch("http://localhost:8000/post/upload/", {
      method: "PUT",
      body: formData,
    });
    const fetchedResult = await res.json();

    setPost("");
    let timestamp = new Date();
    props.setPostRefresh(post + timestamp.toString());
    return fetchedResult;
  };

  return (
    <div className="p-2 border-bottom">
      <div className="row px-2 gx-1">
        <div className="col-1 h-50">
          <div className="ratio ratio-1x1">
            <img
              src={`http://localhost:8000/media/${userCtx.userProfile.serialized_profile.fields.profile_img}`}
              alt="profile-pic"
              className="rounded-circle ratio ratio-1x1"
            />
          </div>
        </div>
        <div className="col-11">
          <textarea
            placeholder="What's happening?"
            className="border-0 rounded-0 form-control shadow-none p-2"
            rows="3"
            onChange={handleInput}
            value={post}
          />
        </div>
      </div>

      <div className="row justify-content-end p-2">
        <div className="d-flex justify-content-between align-items-center px-3 col-11">
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

          <button
            className="btn btn-info rounded-pill w-25 h-75"
            onClick={handleSubmit}
          >
            <h6 className="m-0 p-0 text-white">Babble</h6>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagePost;
