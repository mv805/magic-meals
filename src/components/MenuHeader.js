import React from "react";
import Navbar from "./Navbar";
import "./MenuHeader.css";

const MenuHeader = (props) => {
  return (
    <header className="menu-header">
      <Navbar
        pages={props.pages}
        loginButton={props.loginButton}
        logoutButton={props.logoutButton}
        home = {props.home}
      />
    </header>
  );
};

export default MenuHeader;
