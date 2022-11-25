import React, { useContext, useEffect, useState } from "react";
import Posts from "../../components/Posts/Posts";
import UserContext from "../../context/UserContext";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useHistory } from "react-router-dom";
import Reply from "../../components/Posts/Reply";

const Babble = () => {
  const userCtx = useContext(UserContext);
  const [postRefresh, setPostRefresh] = useState("");
  let history = useHistory();
  const [replies, setReplies] = useState(null);

  const handleBack = () => {
    history.goBack();
  };

  const getReplies = async () => {
    const res = await fetch(
      `https://projectbabblybackend-production.up.railway.app/post/reply/list/${userCtx.babble.pk}/`,
      {
        method: "GET",
        headers: { "content-type": "application/json" },
      }
    );
    const fetchedReplies = await res.json();
    setReplies(fetchedReplies);

    return fetchedReplies;
  };

  useEffect(() => {
    getReplies();
  }, [postRefresh]);

  return (
    <div>
      <div className="d-flex border-bottom bg-white">
        <div
          className="btn border-0 d-flex align-items-center text-dark"
          onClick={handleBack}
        >
          <ArrowBackOutlinedIcon />
        </div>
        <h5 className="py-2 sticky-top m-0">Babble</h5>
      </div>
      <Posts
        post={userCtx.babble.post}
        setPostRefresh={setPostRefresh}
        pk={userCtx.babble.pk}
        repost={false}
      />
      {replies &&
        replies.map((reply, i) => {
          return (
            <Reply
              key={i}
              post={reply.fields}
              pk={reply.pk}
              setPostRefresh={setPostRefresh}
            />
          );
        })}
    </div>
  );
};

export default Babble;
