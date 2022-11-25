import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../../../context/UserContext";
import RecoCard from "./RecoCard";

const Recommended = () => {
  const userCtx = useContext(UserContext);
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = async () => {
    const res = await fetch(
      "https://projectbabblybackend-production.up.railway.app/api/suggestions/",
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: userCtx.userProfile.serialized_profile.fields.handle,
        }),
      }
    );
    const fetchedPostData = await res.json();
    setSuggestions(
      fetchedPostData.slice(0, Math.min(5, fetchedPostData.length))
    );
    return fetchedPostData;
  };

  useEffect(() => {
    getSuggestions();
  }, [userCtx.babbleRefresh]);

  return (
    <div>
      <div className="border border-muted bg-light rounded my-2 p-2">
        <div className="px-2 py-0">
          <h5 className="p-0 m-0">Who to follow</h5>
          {suggestions.length === 0 && (
            <h6 className="py-3 text-center">No new recommendations</h6>
          )}
        </div>
        {suggestions.map((suggestion, i) => {
          return <RecoCard suggestion={suggestion.fields} key={i} />;
        })}
      </div>
    </div>
  );
};

export default Recommended;
