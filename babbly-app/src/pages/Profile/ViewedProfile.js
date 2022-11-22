import React, { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import Posts from "../../components/Posts/Posts";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { useHistory } from "react-router-dom";
import Reply from "../../components/Posts/Reply";

const ViewedProfile = () => {
  const [postRefresh, setPostRefresh] = useState("");
  const [subPage, setSubPage] = useState("Babbles");
  const userCtx = useContext(UserContext);
  const [followStatus, setFollowStatus] = useState(
    userCtx.viewedProfile.button_text
  );

  const getDateJoined = () => {
    const dateJoined = new Date(
      userCtx.viewedProfile.serialized_profile.fields.date_joined
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

  let history = useHistory();
  const handleFollow = async (e) => {
    const res = await fetch("http://localhost:8000/api/follow/", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        follower: userCtx.userProfile.serialized_profile.fields.handle,
        user: userCtx.viewedProfile.serialized_profile.fields.handle,
      }),
    });
    const fetchedResult = await res.json();
    let now = new Date();
    userCtx.setBabbleRefresh("Follow " + now.toTimeString());
    const res2 = await fetch(
      `http://localhost:8000/api/profile/${userCtx.viewedProfile.serialized_profile.fields.handle}/`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: userCtx.userProfile.serialized_profile.fields.handle,
        }),
      }
    );
    const fetchedProfile = await res2.json();
    userCtx.setViewedProfile(fetchedProfile);
    history.push("/Viewed_Profile");
    return fetchedResult;
  };

  return (
    <div className="h-50">
      <h5 className="py-2 px-3 border-bottom sticky-top bg-white m-0">
        {`${userCtx.viewedProfile.serialized_profile.fields.name}'s profile`}
      </h5>
      <div>
        <div
          className="w-100 h-25 d-flex align-items-center justify-content-between jumbotron"
          style={{
            backgroundImage: `url(${`http://localhost:8000/media/${userCtx.viewedProfile.serialized_profile.fields.banner_img}`})`,
          }}
        >
          <div className="w-25 h-100 p-2 d-flex align-items-start">
            <div className="ratio ratio-1x1">
              <img
                src={`http://localhost:8000/media/${userCtx.viewedProfile.serialized_profile.fields.profile_img}`}
                alt="profile-pic"
                className="img-fluid img-thumbnail rounded-circle border-0 mx-2"
              />
            </div>
          </div>
        </div>
        <div className="w-100 h-50 border-bottom">
          <div className="d-flex justify-content-between py-2 px-4">
            <div className="d-flex flex-column">
              <h6 className="p-0 m-0">
                {userCtx.viewedProfile.serialized_profile.fields.name}
              </h6>
              <p className="p-0 m-0 text-muted">
                @{userCtx.viewedProfile.serialized_profile.fields.handle}
              </p>
              <p className="p-0 mx-0 my-1">
                {userCtx.viewedProfile.serialized_profile.fields.bio
                  ? userCtx.viewedProfile.serialized_profile.fields.bio
                  : "~"}
              </p>
              <div className="my-1">
                <div className="d-flex text-muted">
                  {userCtx.viewedProfile.serialized_profile.fields.location && (
                    <div className="d-flex">
                      <RoomOutlinedIcon />
                      <p className="p-0 mx-2 my-0">
                        {
                          userCtx.viewedProfile.serialized_profile.fields
                            .location
                        }
                      </p>
                    </div>
                  )}
                  {userCtx.viewedProfile.serialized_profile.fields.website && (
                    <div className="d-flex mx-2">
                      <LinkOutlinedIcon />
                      <p className="p-0 mx-2 my-0">
                        {
                          userCtx.viewedProfile.serialized_profile.fields
                            .website
                        }
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
                  {userCtx.viewedProfile.user_following}{" "}
                  <span className="text-muted">Following</span>
                </p>
                <p className="p-0 my-0 mx-5">
                  {userCtx.viewedProfile.user_followers}{" "}
                  <span className="text-muted">Followers</span>
                </p>
              </div>
            </div>
            {userCtx.userProfile &&
              userCtx.userProfile.serialized_profile.fields.handle !==
                "admin" && (
                <div className="w-25 h-100 d-flex align-items-end justify-content-end">
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={handleFollow}
                    id={userCtx.viewedProfile.serialized_profile.fields.handle}
                  >
                    <h6 className="p-0 my-1">
                      {userCtx.viewedProfile.button_text}
                    </h6>
                  </button>
                </div>
              )}
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
                {`${userCtx.viewedProfile.user_posts_length} ${
                  userCtx.viewedProfile.user_posts_length -
                    userCtx.viewedProfile.replies_data.length ===
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
                {`${userCtx.viewedProfile.replies_data.length} ${
                  userCtx.viewedProfile.replies_data.length === 1
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
                {`${userCtx.viewedProfile.liked_post_data.length} ${
                  userCtx.viewedProfile.liked_post_data.length === 1
                    ? "Like"
                    : "Likes"
                }`}
              </h5>
            </button>
          </div>
        </div>
      </div>
      {subPage === "Babbles" &&
        userCtx.viewedProfile.serialized_posts.map((post, i) => {
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
        userCtx.viewedProfile.replies_data.map((post, i) => {
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
        userCtx.viewedProfile.liked_post_data.map((post, i) => {
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

export default ViewedProfile;
