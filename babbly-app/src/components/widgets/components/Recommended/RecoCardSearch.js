import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../../../../context/UserContext";

const RecoCardSearch = (props) => {
  const [following, setFollowing] = useState(props.suggestion.button_text);
  const userCtx = useContext(UserContext);
  let history = useHistory();

  useEffect(() => {
    setFollowing(props.suggestion.button_text);
  }, [props.suggestion]);

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
  const handleFollow = async (e) => {
    const res = await fetch("http://localhost:8000/api/follow/", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        follower: userCtx.userProfile.serialized_profile.fields.handle,
        user: props.suggestion.handle,
      }),
    });
    const fetchedResult = await res.json();
    if (following === "Follow") {
      setFollowing("Unfollow");
    } else {
      setFollowing("Follow");
    }
    let now = new Date();
    userCtx.setBabbleRefresh("Refresh " + now.toTimeString());
    return fetchedResult;
  };
  return (
    <div className="btn row py-2 px-2 gx-1 w-100 d-flex align-items-center border-0 mx-2 my-1">
      <div className="col-1 jumbotron">
        <div className="ratio ratio-1x1">
          <img
            src={`http://localhost:8000/media/${props.suggestion.profile_img}`}
            alt="profile-pic"
            className="img-fluid rounded-circle ratio ratio-1x1"
            id={props.suggestion.handle}
            onClick={handleViewedProfile}
          />
        </div>
      </div>
      <div className="col-11">
        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-8 d-flex px-3" onClick={handleViewedProfile}>
            <h6
              className="btn mx-1 my-0 p-0 font-weight-bold border-0"
              id={props.suggestion.handle}
            >
              {props.suggestion.name}
            </h6>
            <p
              className="btn m-0 p-0 text-muted border-0"
              id={props.suggestion.handle}
            >
              @{props.suggestion.handle}
            </p>
          </div>
          <div className="col-4 d-flex justify-content-end">
            {userCtx.userProfile &&
              userCtx.userProfile.serialized_profile.fields.handle !==
                "admin" && (
                <button
                  className="btn btn-dark btn-sm rounded-pill mx-3 p-1 h-50 w-50"
                  onClick={handleFollow}
                >
                  <p className="m-0 p-0 text-white text-left">{following}</p>
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoCardSearch;
