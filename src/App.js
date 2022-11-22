import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Link } from "react-router-dom";

import "./App.css";
import UserContext from "./context/UserContext";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Widgets from "./components/widgets/Widgets";
import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RegistrationSuccess from "./pages/Register/RegistrationSuccess";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import DeleteProfile from "./pages/Profile/DeleteProfile";
import ViewedProfile from "./pages/Profile/ViewedProfile";
import Search from "./pages/Search/Search";
import Babble from "./pages/Post/Babble";

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [viewedProfile, setViewedProfile] = useState(null);
  const [babbleRefresh, setBabbleRefresh] = useState(null);
  const [search, setSearch] = useState(null);
  const [babble, setBabble] = useState(null);
  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        viewedProfile,
        setViewedProfile,
        babbleRefresh,
        setBabbleRefresh,
        search,
        setSearch,
        babble,
        setBabble,
      }}
    >
      <div className="container-fluid d-flex flex-column overflow-hidden">
        <div className="d-flex w-100 p-0">
          {/* Left section */}
          <Navbar />

          {/* Middle section */}
          <div className="cotainer-fluid w-50 vh-100 border border-top-0 mx-3 overflow-auto scroller">
            <Switch>
              <Route exact path="/">
                <Explore />
              </Route>
              <Route exact path="/Login">
                <Login />
              </Route>
              <Route exact path="/Sign_Up">
                <Register />
              </Route>
              <Route exact path="/Successful_Registration">
                <RegistrationSuccess />
              </Route>
              <Route exact path="/Home">
                <Home />
              </Route>
              <Route exact path="/Profile">
                <Profile />
              </Route>
              <Route exact path="/Viewed_Profile">
                <ViewedProfile />
              </Route>

              <Route exact path="/Profile_Edit">
                <EditProfile />
              </Route>
              <Route exact path="/Profile_Delete">
                <DeleteProfile />
              </Route>
              <Route exact path="/Search">
                <Search />
              </Route>
              <Route exact path="/Babble">
                <Babble />
              </Route>
            </Switch>
          </div>

          {/* Right section */}
          <Widgets />
        </div>

        {/* Login banner (page-bottom)*/}
        {!userProfile && (
          <div className="d-flex justify-content-end px-5 fixed-bottom bg-info py-2">
            <div className="d-flex justify-content-between w-75">
              <div className="d-flex flex-column px-2">
                <h6 className="m-0 p-0 display-6 text-white">
                  Don't miss what's happening
                </h6>
                <p className="m-0 p-0 text-white">
                  People on Babbly are the first to know!
                </p>
              </div>
              <div className="d-flex align-items-center mx-5">
                <Link
                  to="/Login"
                  className="btn btn-outline-light btn-sm mx-2 rounded-pill"
                >
                  <h6 className="m-0 p-0">Log in</h6>
                </Link>
                <Link
                  to="/Sign_up"
                  className="btn btn-light btn-sm rounded-pill"
                >
                  <h6 className="m-0 p-0">Sign up</h6>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
