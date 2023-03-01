import { signOut } from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase_setup/firebase";
import "./Navbar.css";
import navPages from "../nav-directory";


const UserLoginButton = (props) => {
  const navigate = useNavigate();

  const logUserOut = () => {
    signOut(auth)
      .then(() => {
        navigate(`${navPages.Main}`);
      })
      .catch((error) => {
        alert(error);
        navigate(`${navPages.Main}`);
      });
  };

  return (
    <>
      {props.login && (
        <li className="mobile-nav-list-items">
          <button>
            <Link to={`${navPages.Login}`}>Login</Link>
          </button>
        </li>
      )}
      {props.logout && (
        <li className="mobile-nav-list-items">
          <button onClick={logUserOut}>
            <Link to={`${navPages.Main}`}>Logout</Link>
          </button>
        </li>
      )}
    </>
  );
};

export default UserLoginButton;
