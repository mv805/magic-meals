import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Disclaimer.scss";

const Disclaimer = () => {
  return (
    <article className="disclaimer">
      <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} />
      <p>
        WARNING: Do not utilize this website to guide medical treatment of any
        kind. This website is to be used for entertainment purposes only.
      </p>
    </article>
  );
};

export default Disclaimer;
