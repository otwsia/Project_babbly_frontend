import React, { useContext, useEffect, useState } from "react";
import Posts from "../../components/Posts/Posts";
import PagePost from "../../components/widgets/components/PagePost";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UserContext from "../../context/UserContext";

const Explore = () => {
  const userCtx = useContext(UserContext);
  const [postRefresh, setPostRefresh] = useState("");
  const [postList, setPostList] = useState([]);
  const [currentListLen, setCurrentListLen] = useState(0);
  const [listDiff, setListDiff] = useState(0);

  const getPosts = async () => {
    try {
      const res = await fetch(
        "https://projectbabblybackend-production.up.railway.app/post/list/",
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ user: "None" }),
        }
      );
      const fetchedPostData = await res.json();
      setPostList(fetchedPostData);
      setCurrentListLen(fetchedPostData.length);
      setListDiff(0);
    } catch (err) {
      console.log(err);
    }
  };

  const checkPosts = async () => {
    try {
      const res = await fetch(
        "https://projectbabblybackend-production.up.railway.app/post/list/",
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ user: "None" }),
        }
      );
      const fetchedPostData = await res.json();
      setListDiff(fetchedPostData.length - currentListLen);

      return fetchedPostData;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, [postRefresh, userCtx.babbleRefresh]);

  useEffect(() => {
    const interval = setInterval(() => {
      return checkPosts();
    }, 60000);
    return () => clearInterval(interval);
  }, [currentListLen]);

  return (
    <div className="w-100">
      <h5 className="py-2 px-3 border-bottom sticky-top bg-white">Explore</h5>
      {userCtx.userProfile &&
        userCtx.userProfile.serialized_profile.fields.handle !== "admin" && (
          <PagePost setPostRefresh={setPostRefresh} />
        )}
      {listDiff > 0 && (
        <div
          className="btn d-flex justify-content-center align-items-center p-2 border-bottom rounded-0"
          onClick={getPosts}
        >
          <AddCircleOutlineIcon />
          <h6 className="p-0 my-0 mx-2">{`Show ${listDiff} new Babbles`}</h6>
        </div>
      )}
      {postList.map((post, i) => {
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
    </div>
  );
};

export default Explore;
