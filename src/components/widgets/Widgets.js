import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Authentication from "./components/Authentication";
import Recommended from "./components/Recommended/Recommended";

const Widgets = () => {
  const userCtx = useContext(UserContext);
  const [query, setQuery] = useState("");
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    userCtx.setSearch(query);
    setQuery("");
    history.push("/Search");
  };
  return (
    <div className="w-25 mx-3">
      {userCtx.userProfile && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="🔍    Search"
            className="w-100 rounded-pill border border-muted bg-light mt-2 px-2"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </form>
      )}
      {!userCtx.userProfile && <Authentication />}
      {userCtx.userProfile &&
        userCtx.userProfile.serialized_profile.fields.handle !== "admin" && (
          <Recommended />
        )}
    </div>
  );
};

export default Widgets;
