import React, { useContext, useEffect, useState } from "react";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { Button } from "@mui/material";

const Posts = (props) => {
  const userCtx = useContext(UserContext);
  const [del, setDel] = useState(false);
  const [reply, setReply] = useState("");
  const [repost, setRepost] = useState(false);
  const [like, setLike] = useState(false);
  const [postPic, setPostPic] = useState(null);

  let id_post;
  if (props.post.id) {
    id_post = props.post.id;
  } else {
    id_post = props.pk;
  }

  const handleMore = () => {
    setDel(true);
  };
  useEffect(() => {
    const returnMore = setTimeout(() => {
      setDel(false);
    }, 5000);
    return () => clearTimeout(returnMore);
  }, [handleMore]);

  const postTimeStamp = () => {
    const dateCreated = new Date(props.post.created_at);
    const now = new Date();
    let timeDiff = Math.abs(now - dateCreated) / 36e5;
    if (timeDiff > 24) {
      timeDiff = Math.floor(timeDiff / 24) + "d";
    } else if (timeDiff >= 1) {
      timeDiff = Math.floor(timeDiff) + "h";
    } else if (timeDiff >= 1 / 60) {
      timeDiff = Math.floor(timeDiff * 60) + "m";
    } else {
      timeDiff = Math.floor(timeDiff * 3600) + "s";
    }
    return timeDiff;
  };

  const handleReplyContent = (e) => {
    setReply(e.target.value);
  };

  const handlePostPic = (e) => {
    setPostPic(e.target.files[0]);
  };

  const handleReply = async () => {
    if (reply.length > 160) {
      return alert("Alert: Input character limit exceeded");
    }
    if (reply.length === 0) {
      return alert("Alert: No input");
    }
    let formData = new FormData();
    formData.append(
      "user",
      `${userCtx.userProfile.serialized_profile.fields.handle}`
    );
    formData.append("caption", reply);
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
      `http://localhost:8000/post/reply/upload/${id_post}/`,
      {
        method: "PUT",
        body: formData,
      }
    );
    const fetchedResult = await res.json();
    props.post.no_of_replies += 1;
    setReply("");
    return fetchedResult;
  };

  const handleRepost = async () => {
    if (
      props.post.user === userCtx.userProfile.serialized_profile.fields.handle
    ) {
      return alert("Action invalid: Users cannot repost their own post");
    }
    const res = await fetch(`http://localhost:8000/post/repost/`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        handle: userCtx.userProfile.serialized_profile.fields.handle,
        name: userCtx.userProfile.serialized_profile.fields.name,
        post_id: id_post,
      }),
    });
    const fetchedResult = await res.json();
    setRepost(fetchedResult);
    if (fetchedResult === "Reposted") {
      props.post.no_of_reposts++;
      props.setPostRefresh("repost " + id_post);
    } else {
      props.post.no_of_reposts--;
      props.setPostRefresh("unreposted " + id_post);
    }
  };

  const handleLike = async () => {
    const res = await fetch(`http://localhost:8000/post/like/`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        handle: userCtx.userProfile.serialized_profile.fields.handle,
        post_id: id_post,
      }),
    });
    const fetchedResult = await res.json();
    if (fetchedResult === "Liked") {
      props.post.no_of_likes++;
      setLike(fetchedResult);
    } else {
      props.post.no_of_likes--;
      setLike(fetchedResult);
    }
    return fetchedResult;
  };

  let history = useHistory();
  const handleViewedProfile = async (e) => {
    const handle = e.target.id;
    if (handle === userCtx.userProfile.serialized_profile.fields.handle) {
      history.push("/Profile");
      return "Navigated to profile page";
    } else {
      const res = await fetch(`http://localhost:8000/api/profile/${handle}/`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: userCtx.userProfile.serialized_profile.fields.handle,
        }),
      });
      const fetchedProfile = await res.json();
      userCtx.setViewedProfile(fetchedProfile);

      history.push("/Viewed_Profile");
      return fetchedProfile;
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:8000/post/delete/`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: id_post,
      }),
    });
    const fetchedResult = await res.json();
    props.setPostRefresh("deleted " + id_post);
    return fetchedResult;
  };

  const handleRedirect = () => {
    userCtx.setBabble({
      post: props.post,
      pk: props.pk,
    });
    history.push("/Babble");
  };

  return (
    <div className={`w-100 border-bottom ${props.reply && "border-bottom-0"}`}>
      {props.repost && (
        <div className="row pt-1 pb-0 px-3 px-3 gx-1 w-100">
          <div className="col-1"></div>
          <div className="col-11 px-2 d-flex text-muted">
            <CachedOutlinedIcon />
            <p className="w-25 p-0 my-0 mx-2">{`${props.reposter} Rebabbled`}</p>
          </div>
        </div>
      )}
      <div className="row py-2 px-3 gx-1 w-100">
        <div className="col-1" onClick={handleRedirect}>
          <div className="ratio ratio-1x1">
            <img
              src={`http://localhost:8000/media/${props.post.profile_img}`}
              alt="profile-pic"
              className="img-fluid rounded-circle"
              onClick={handleViewedProfile}
              id={props.post.user}
            />
          </div>
        </div>
        <div className="col-11 px-2">
          <div className="row d-flex justify-content-between">
            <div className="d-flex align-items-center w-75">
              <h6
                className="btn mx-1 my-0 p-0 font-weight-bold border-0"
                onClick={handleViewedProfile}
                id={props.post.user}
              >
                {props.post.name}
              </h6>
              <p
                className="btn mx-1 my-0 p-0 text-muted border-0"
                onClick={handleViewedProfile}
                id={props.post.user}
              >
                @{props.post.user}
              </p>
              <p className="mx-0 my-0 p-0 text-muted">•</p>
              <p className="mx-1 my-0 p-0 text-muted">{postTimeStamp()}</p>
            </div>
            {userCtx.userProfile &&
              (userCtx.userProfile.serialized_profile.fields.handle ===
                props.post.user ||
                userCtx.userProfile.serialized_profile.fields.handle ===
                  "admin") &&
              !props.repost &&
              del && (
                <button
                  className="btn btn-sm col-1 border-0 d-flex align-items-start p-0 m-0"
                  onClick={handleDelete}
                >
                  <DeleteForeverOutlinedIcon />
                </button>
              )}
            {userCtx.userProfile &&
              (userCtx.userProfile.serialized_profile.fields.handle ===
                props.post.user ||
                userCtx.userProfile.serialized_profile.fields.handle ===
                  "admin") &&
              !props.repost &&
              !del && (
                <button
                  className="btn btn-sm col-1 border-0 d-flex align-items-start p-0 m-0"
                  onClick={handleMore}
                >
                  <MoreHorizOutlinedIcon />
                </button>
              )}
          </div>

          <div className="row" onClick={handleRedirect}>
            <p className="font-weight-light mx-1">{props.post.caption}</p>
          </div>
          {props.post.image && (
            <img
              src={`http://localhost:8000/media/${props.post.image}`}
              alt="profile-pic"
              className="img-fluid w-100 border rounded-3"
              id={props.post.user}
              onClick={handleRedirect}
            />
          )}
        </div>
      </div>
      {userCtx.userProfile &&
        userCtx.userProfile.serialized_profile.fields.handle !== "admin" && (
          <div className="row d-flex justify-content-end  py-2 px-3 gx-1 ">
            <div className="col-11 px-2">
              <div className="row d-flex justify-content-between">
                <div className="col-3 d-flex align-items-center">
                  <button
                    className="w-25 btn btn-sm col-1 border-0 d-flex p-0 m-0"
                    type="button"
                    data-bs-toggle={userCtx.userProfile && "modal"}
                    data-bs-target={`#modal${id_post}`}
                  >
                    <ChatBubbleOutlineOutlinedIcon />
                  </button>
                  <p className="w-75 px-2 py-0 m-0">
                    {props.post.no_of_replies != 0 && props.post.no_of_replies}
                  </p>
                </div>
                <div className="col-3 d-flex align-items-center">
                  <button
                    className="w-25 btn btn-sm col-1 border-0 d-flex p-0 m-0"
                    onClick={userCtx.userProfile && handleRepost}
                  >
                    <CachedOutlinedIcon />
                  </button>
                  <p className="w-75 px-2 py-0 m-0">
                    {props.post.no_of_reposts != 0 && props.post.no_of_reposts}
                  </p>
                </div>
                <div className="col-3 d-flex align-items-center">
                  <button
                    className="w-25 btn btn-sm col-1 border-0 d-flex p-0 m-0"
                    onClick={userCtx.userProfile && handleLike}
                  >
                    <FavoriteBorderIcon />
                  </button>
                  <p className="w-75 px-2 py-0 m-0">
                    {props.post.no_of_likes != 0 && props.post.no_of_likes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Reply Modal */}
      {userCtx.userProfile && (
        <div
          className="modal fade"
          id={`modal${id_post}`}
          tabindex="-1"
          aria-labelledby="babbleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="babbleModalLabel">
                  Reply
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Post being replied to */}
                <div className="row gx-1 w-100">
                  <div className="col-1">
                    <div className="ratio ratio-1x1">
                      <img
                        src={`http://localhost:8000/media/${props.post.profile_img}`}
                        alt="profile-pic"
                        className="img-fluid rounded-circle"
                        onClick={handleViewedProfile}
                        id={id_post}
                      />
                    </div>
                  </div>
                  <div className="col-11 px-2">
                    <div className="row d-flex justify-content-between">
                      <div className="d-flex align-items-center w-75">
                        <h6
                          className="btn mx-1 my-0 p-0 font-weight-bold border-0"
                          onClick={handleViewedProfile}
                          id={id_post}
                        >
                          {props.post.name}
                        </h6>
                        <p
                          className="btn mx-1 my-0 p-0 text-muted border-0"
                          onClick={handleViewedProfile}
                          id={id_post}
                        >
                          @{props.post.user}
                        </p>
                        <p className="mx-0 my-0 p-0 text-muted">•</p>
                        <p className="mx-1 my-0 p-0 text-muted">
                          {postTimeStamp()}
                        </p>
                      </div>
                      {userCtx.userProfile &&
                        userCtx.userProfile.serialized_profile.fields.handle ===
                          props.post.user &&
                        del && (
                          <button
                            className="btn btn-sm col-1 border-0 d-flex align-items-start p-0 m-0"
                            onClick={handleDelete}
                          >
                            <DeleteForeverOutlinedIcon />
                          </button>
                        )}
                      {userCtx.userProfile &&
                        userCtx.userProfile.serialized_profile.fields.handle ===
                          props.post.user &&
                        !del && (
                          <button
                            className="btn btn-sm col-1 border-0 d-flex align-items-start p-0 m-0"
                            onClick={handleMore}
                          >
                            <MoreHorizOutlinedIcon />
                          </button>
                        )}
                    </div>
                    <div className="row">
                      <p className="font-weight-light mx-1">
                        {props.post.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reply input */}
                <div className="row gx-1">
                  <div className="col-1 d-flex justify-content-center py-1">
                    <SubdirectoryArrowRightIcon />
                  </div>

                  <img
                    src={`http://localhost:8000/media/${userCtx.userProfile.serialized_profile.fields.profile_img}`}
                    alt="profile-pic"
                    className="h-50 rounded-circle col-1"
                  />
                  <div className="col-10">
                    <textarea
                      placeholder="Babble your reply"
                      className="border-0 rounded-0 form-control shadow-none p-2"
                      rows="4"
                      onChange={handleReplyContent}
                      value={reply}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <div className="w-50 m-0 p-0 h-100">
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
                  className="btn btn-info rounded-pill w-25 h-75"
                  onClick={handleReply}
                  data-bs-dismiss="modal"
                >
                  <h6 className="m-0 p-0 text-white">Babble</h6>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
