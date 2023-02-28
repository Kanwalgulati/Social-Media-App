import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Component/Header/Header";
import Login from "./Component/Login/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadUser } from "./Action/User";
import Home from "./Component/Home/Home";
import Account from "./Component/Account/Account";
import NewPost from "./Component/NewPost/NewPost";
import Register from "./Component/Register/Register";
import UpdateProfile from "./Component/UpdateProfile/UpdateProfile";
import UpdatePassword from "./Component/UpdatePassword/UpdatePassword";
import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
import ResetPassword from "./Component/ResetPassword/ResetPassword";
import UserProfile from "./Component/UserProfile/UserProfile";
import Search from "./Component/Search/Search";
import NotFound from "./Component/NotFound/NotFound";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(LoadUser());
  }, [dispatch]);
  return (
    <div className="App">
      <Router>
        {isAuthenticated && <Header />}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
          <Route
            path="/account"
            element={isAuthenticated ? <Account /> : <Login />}
          />
          <Route
            path="/newpost"
            element={isAuthenticated ? <NewPost /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Account /> : <Register />}
          />
          <Route
            path="/update/profile"
            element={isAuthenticated ? <UpdateProfile /> : <Login />}
          />
          <Route
            path="/update/password"
            element={isAuthenticated ? <UpdatePassword /> : <Login />}
          />
          <Route
            path="/forgot/password"
            element={isAuthenticated ? <UpdatePassword /> : <ForgotPassword />}
          />
          <Route
            path="/reset/password/:token"
            element={isAuthenticated ? <UpdatePassword /> : <ResetPassword />}
          />
          <Route
            path="/user/:id"
            element={isAuthenticated ? <UserProfile /> : <Login />}
          />
          <Route
            path="/search"
            element={isAuthenticated ? <Search /> : <Login />}
          />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
