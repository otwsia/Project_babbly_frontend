import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Posts from "../../components/Posts/Posts";
import RecoCardSearch from "../../components/widgets/components/Recommended/RecoCardSearch";
import UserContext from "../../context/UserContext";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

const Search = () => {
  let userCtx = useContext(UserContext);
  const [searchRes, setSearchRes] = useState(null);
  const [postRefresh, setPostRefresh] = useState("");

  const getSearchRes = async () => {
    if (!userCtx.search) {
      setSearchRes(null);
      return;
    }
    try {
      const res = await fetch(
        `https://projectbabblybackend-production.up.railway.app/api/search/${userCtx.userProfile.serialized_profile.fields.handle}/${userCtx.search}/`,
        {
          method: "GET",
          headers: { "content-type": "application/json" },
        }
      );
      const fetchedPostData = await res.json();
      setSearchRes(fetchedPostData);

      return fetchedPostData;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSearchRes();
  }, [userCtx.search, userCtx.babbleRefresh]);

  let history = useHistory();

  const handleBack = () => {
    history.goBack();
  };

  return (
    <div className="w-100">
      <div className="d-flex border-bottom bg-white">
        <div
          className="btn d-flex align-items-center text-dark border-0"
          onClick={handleBack}
        >
          <ArrowBackOutlinedIcon />
        </div>
        <h5 className="py-2 sticky-top bg-white m-0">
          {`Search: "${userCtx.search ? userCtx.search : ""}"`}
        </h5>
      </div>

      {searchRes && (
        <div className="w-100 border-bottom">
          <h5 className="py-2 px-3 m-0">People</h5>
          {searchRes.serialized_profiles.length !== 0 &&
            searchRes.serialized_profiles.map((suggestion, i) => {
              return <RecoCardSearch suggestion={suggestion.fields} key={i} />;
            })}
          {searchRes.serialized_profiles.length === 0 && (
            <h5 className="p-0 mt-0 mb-3 text-center text-muted">No results</h5>
          )}
        </div>
      )}
      {searchRes && (
        <div
          className={`w-100 ${
            searchRes.serialized_posts.length === 0 && "border-bottom"
          }`}
        >
          <h5 className="py-2 px-3 m-0">Babbles</h5>
          {searchRes.serialized_posts.length !== 0 &&
            searchRes.serialized_posts.map((post, i) => {
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
          {searchRes.serialized_posts.length === 0 && (
            <h5 className="p-0 mt-0 mb-3 text-center text-muted">No results</h5>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
