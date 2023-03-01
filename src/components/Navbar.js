import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import navPages from "../nav-directory";
import uniqid from "uniqid";
import "./Navbar.scss";
import "../fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "firebase/auth";
import { auth } from "../firebase_setup/firebase";

const Navbar = (props) => {
  //for finding the window size to switch back and forth between mobile and desktop
  const useWindowWide = (size) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [setWidth]);
    return width < size;
  };

  //outside clicking detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileNavListRef.current &&
        !mobileNavListRef.current.contains(event.target) &&
        !mobileMenuButton.current.contains(event.target)
      ) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const navigate = useNavigate();
  const MOBILE_BREAKPOINT = 600;
  const windowIsMobileWidth = useWindowWide(MOBILE_BREAKPOINT);
  const mobileNavListRef = useRef(null);
  const mobileMenuButton = useRef(null);
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavBar = () => {
    if (navbarOpen) {
      setNavbarOpen(false);
    } else {
      setNavbarOpen(true);
    }
  };

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

  let pageLinks;

  if (props.pages) {
    pageLinks = props.pages.map((page) => {
      return (
        <li key={uniqid()}>
          <Link to={navPages[`${page}`]}>{`${page}`}</Link>
        </li>
      );
    });
  }

  const homeLink = (
    <li key={uniqid()}>
      {auth.currentUser && (
        <Link to={navPages["Home"](auth.currentUser.uid)}>Home</Link>
      )}
    </li>
  );

  const mobileOptionsList = (
    <ul className="mobile-nav-list nav-shadow" ref={mobileNavListRef}>
      {props.home && homeLink}
      {props.pages && pageLinks}
      {props.loginButton && (
        <li className="mobile-nav-list-items">
          <button
            onClick={() => {
              navigate(`${navPages.Login}`);
            }}
          >
            Login
          </button>
        </li>
      )}
      {props.logoutButton && (
        <li className="mobile-nav-list-items">
          <button onClick={logUserOut}>Logout</button>
        </li>
      )}
    </ul>
  );

  const appTitle = (
    <div className="app-title">
      <h5>Magic Meals</h5>
      <FontAwesomeIcon icon={["fas", "wand-magic-sparkles"]} />
    </div>
  );

  const mobileMenu = (
    <>
      <div className="nav-header nav-shadow">
        {appTitle}
        <button
          className="mobile-button"
          onClick={toggleNavBar}
          ref={mobileMenuButton}
        >
          <FontAwesomeIcon icon={["fas", "bars"]} />
        </button>
      </div>
      {windowIsMobileWidth && navbarOpen ? mobileOptionsList : ""}
    </>
  );

  const desktopMenu = (
    <div className="nav-header nav-shadow">
      {appTitle}
      {
        <ul className="navlist">
          {props.home && homeLink}
          {props.pages &&
            props.pages.map((page) => {
              return (
                <li key={uniqid()}>
                  <Link to={`${navPages[`${page}`]}`}>{`${page}`}</Link>
                </li>
              );
            })}
          {props.loginButton && (
            <li>
              <Link to={`${navPages.Login}`}>
                <button>Login</button>
              </Link>
            </li>
          )}
          {props.logoutButton && (
            <li>
              <button onClick={logUserOut}>Logout</button>
            </li>
          )}
        </ul>
      }
    </div>
  );

  return (
    <nav className="navbar nav-shadow">
      {windowIsMobileWidth ? mobileMenu : desktopMenu}
    </nav>
  );
};

export default Navbar;
