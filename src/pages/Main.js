import React, { useEffect, useState } from "react";
import MenuHeader from "../components/MenuHeader";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import navPages from "../nav-directory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Disclaimer from "../components/Disclaimer";
import "./Main.scss";
import LoadingSpinner from "../components/LoadingSpinner";

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (userFetched) => {
      if (userFetched) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });
  }, []);

  const pageView = (
    <main className="container main-page">
      <h1>
        <FontAwesomeIcon icon={["fas", "wand-magic-sparkles"]} />
        Hello. Welcome to Magic Meals!
        <FontAwesomeIcon icon={["fas", "wand-magic-sparkles"]} />
      </h1>
      <p>
        We aim to help keep people informed and aware of potentially dangerous
        foods and recipes that may contain allergens of concern.
      </p>
      <Disclaimer />
      <h2>Identifying allergenic foods can be a challenge</h2>
      <p>
        A common problem for those with food allergies is not always being able
        to easily identify sources of potential allergen when eating non-labeled
        foods. We hope to help you generate a quick reference list of common
        foods that might contain allergenic foods for your ease of use.
      </p>
      <p>
        After asking yourself if a food might contain an allergen of concern,
        perform your research and record the assessment to the list for yourself
        and all group members to review quickly and easily without need to
        re-research everytime.
      </p>
      {!isLoggedIn && (
        <button
          onClick={() => {
            navigate(`${navPages.Login}`);
          }}
        >
          Login Now!
        </button>
      )}
    </main>
  );

  const loggedInView = (
    <>
      <MenuHeader home pages={["Instructions"]} logoutButton />
      {pageView}
    </>
  );

  const loggedOutView = (
    <>
      <MenuHeader pages={["Instructions"]} loginButton />
      {pageView}
    </>
  );

  const loadingView = (
    <>
      <MenuHeader />
      <LoadingSpinner />
    </>
  );

  if (isLoading) {
    return loadingView;
  } else if (isLoggedIn) {
    return loggedInView;
  } else {
    return loggedOutView;
  }
};

export default Main;
