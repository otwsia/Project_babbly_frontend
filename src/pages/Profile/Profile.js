import React, { useContext, useEffect, useState } from "react";

import UserContext from "../../context/UserContext";

import Posts from "../../components/Posts/Posts";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { Link } from "react-router-dom";
import Reply from "../../components/Posts/Reply";

const Profile = () => {
  const [subPage, setSubPage] = useState("Babbles");
  const userCtx = useContext(UserContext);
  const [postRefresh, setPostRefresh] = useState("");

  const refreshProfileData = async () => {
    const res = await fetch(
      `https://projectbabblybackend-production.up.railway.app/api/profile/${userCtx.userProfile.serialized_profile.fields.handle}/`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: userCtx.userProfile.serialized_profile.fields.handle,
        }),
      }
    );
    const fetchedProfileData = await res.json();
    userCtx.setUserProfile(fetchedProfileData);
    return fetchedProfileData;
  };

  useEffect(() => {
    refreshProfileData();
  }, [subPage, postRefresh, userCtx.babbleRefresh]);

  const getDateJoined = () => {
    const dateJoined = new Date(
      userCtx.userProfile.serialized_profile.fields.date_joined
    );
    let text =
      dateJoined.toString().slice(4, 8) + dateJoined.toString().slice(13, 15);
    return text;
  };

  const handleBabbles = () => {
    setSubPage("Babbles");
  };
  const handleReplies = () => {
    setSubPage("Replies");
  };
  const handleLikes = () => {
    setSubPage("Likes");
  };

  return (
    <div className="w-100">
      <h5 className="py-2 px-3 border-bottom sticky-top bg-white m-0">
        {`${userCtx.userProfile.serialized_profile.fields.name}'s profile`}
      </h5>
      <div>
        <div
          className="w-100 h-25 d-flex align-items-center justify-content-between bg-image jumbotron"
          style={{
            backgroundImage: `url(${`https://projectbabblybackend-production.up.railway.app/media/${userCtx.userProfile.serialized_profile.fields.banner_img}`})`,
          }}
        >
          <div className="w-75 p-3">
            <div className="w-25 d-flex align-items-start">
              <div className=" ratio ratio-1x1">
                <img
                  src={`https://projectbabblybackend-production.up.railway.app/media/${userCtx.userProfile.serialized_profile.fields.profile_img}`}
                  alt="profile-pic"
                  className="img-fluid img-thumbnail rounded-circle border-0 mx-2 ratio ratio-1x1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 h-50 border-bottom">
          <div className="d-flex justify-content-between py-2 px-4">
            <div className="d-flex flex-column">
              <h6 className="p-0 m-0">
                {userCtx.userProfile.serialized_profile.fields.name}
              </h6>
              <p className="p-0 m-0 text-muted">
                @{userCtx.userProfile.serialized_profile.fields.handle}
              </p>
              <p className="p-0 mx-0 my-1">
                {userCtx.userProfile.serialized_profile.fields.bio
                  ? userCtx.userProfile.serialized_profile.fields.bio
                  : "~"}
              </p>
              <div className="my-1">
                <div className="d-flex text-muted">
                  {userCtx.userProfile.serialized_profile.fields.location && (
                    <div className="d-flex">
                      <RoomOutlinedIcon />
                      <p className="p-0 mx-2 my-0">
                        {userCtx.userProfile.serialized_profile.fields.location}
                      </p>
                    </div>
                  )}
                  {userCtx.userProfile.serialized_profile.fields.website && (
                    <div className="d-flex mx-2">
                      <LinkOutlinedIcon />
                      <p className="p-0 mx-2 my-0">
                        {userCtx.userProfile.serialized_profile.fields.website}
                      </p>
                    </div>
                  )}
                </div>
                <div className="d-flex text-muted">
                  <CalendarMonthOutlinedIcon />
                  <p className="p-0 mx-2 my-0">Joined {getDateJoined()}</p>
                </div>
              </div>

              <div className="d-flex my-1">
                <p className="p-0 m-0">
                  {userCtx.userProfile.user_following}{" "}
                  <span className="text-muted">Following</span>
                </p>
                <p className="p-0 my-0 mx-5">
                  {userCtx.userProfile.user_followers}{" "}
                  <span className="text-muted">Followers</span>
                </p>
              </div>
            </div>
            <div className="w-25 h-100 d-flex align-items-end justify-content-end">
              <Link
                to="/Profile_Edit"
                className="btn btn-outline-secondary btn-sm rounded-pill"
              >
                <h6 className="p-0 my-1">Edit profile</h6>
              </Link>
            </div>
          </div>
          <div className="w-100 h-25 d-flex justify-content-around align-items-end">
            <button
              className="btn col-4 border-0 rounded-0 bg-white text-muted fst-normal"
              onClick={handleBabbles}
            >
              <h5
                className={`p-0 m-0 ${
                  subPage === "Babbles" && "text-dark fw-bolder"
                }`}
              >
                {`${userCtx.userProfile.user_posts_length} ${
                  userCtx.userProfile.user_posts_length -
                    userCtx.userProfile.replies_data.length ===
                  1
                    ? "Babble"
                    : "Babbles"
                }`}
              </h5>
            </button>
            <button
              className="btn col-4 border-0 rounded-0 bg-white text-muted fst-normal"
              onClick={handleReplies}
            >
              <h5
                className={`p-0 m-0 ${
                  subPage === "Replies" && "text-dark fw-bolder"
                }`}
              >
                {`${userCtx.userProfile.replies_data.length} ${
                  userCtx.userProfile.replies_data.length === 1
                    ? "Reply"
                    : "Replies"
                }`}
              </h5>
            </button>
            <button
              className="btn col-4 border-0 rounded-0 bg-white text-muted fst-normal"
              onClick={handleLikes}
            >
              <h5
                className={`p-0 m-0 ${
                  subPage === "Likes" && "text-dark fw-bolder"
                }`}
              >
                {`${userCtx.userProfile.liked_post_data.length} ${
                  userCtx.userProfile.liked_post_data.length === 1
                    ? "Like"
                    : "Likes"
                }`}
              </h5>
            </button>
          </div>
        </div>
      </div>
      {subPage === "Babbles" &&
        userCtx.userProfile.serialized_posts.map((post, i) => {
          return (
            <>
              {!post.fields.repost && (
                <Posts
                  key={i}
                  post={post.fields}
                  setPostRefresh={setPostRefresh}
                  pk={post.pk}
                  repost={false}
                />
              )}
              {post.fields.repost && (
                <Posts
                  key={i}
                  post={post.fields.caption.fields}
                  setPostRefresh={setPostRefresh}
                  pk={post.fields.caption.pk}
                  reposter={post.fields.name}
                  repost={true}
                />
              )}
            </>
          );
        })}
      {subPage === "Replies" &&
        userCtx.userProfile.replies_data.map((post, i) => {
          return (
            <>
              {!post.fields.repost && (
                <Posts
                  key={i}
                  post={post.fields.og_post.fields}
                  pk={post.fields.og_post.pk}
                  reply={true}
                  setPostRefresh={setPostRefresh}
                />
              )}
              <Reply
                key={i}
                post={post.fields}
                pk={post.pk}
                setPostRefresh={setPostRefresh}
              />
            </>
          );
        })}
      {subPage === "Likes" &&
        userCtx.userProfile.liked_post_data.map((post, i) => {
          return (
            !post.fields.repost && (
              <Posts
                key={i}
                post={post.fields}
                pk={post.pk}
                setPostRefresh={setPostRefresh}
              />
            )
          );
        })}
    </div>
  );
};

export default Profile;
