import React, { useEffect, useState } from "react";
import MenuHeader from "../components/MenuHeader";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase_setup/firebase";
import { useNavigate } from "react-router-dom";
import navPages from "../nav-directory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import stepOne from "../assets/step-1.PNG";
import stepTwo from "../assets/step-2.PNG";
import stepThree from "../assets/step-3.PNG";
import stepFour from "../assets/step-4.PNG";
import Disclaimer from "../components/Disclaimer";

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
      <h2>An example use case...</h2>
      <p>
        As an example, assuming you are allergic to Eggs, you might wonder if
        some ranch dressing you are served at a restaurant might contain this
        allergen. Complete some of your own online research and make an
        assesment and record this food to your list.{" "}
      </p>
      <p>
        In this example, yes ranch dresssing commonly uses eggs as a primary
        ingredient and should be avoided at all times.
      </p>
      <p>
        Now that you have recorded the food, other members of the group can see
        the same list and avoid it.
      </p>
      <p>
        From now on you have this food noted for all group members and yourself
        to see so you do not have to do the same research every time you forget
        if ranch might contain eggs.
      </p>
      <h2>
        Follow the steps below to learn how to utilize this application for your
        allergen assesment needs
      </h2>
      <article>
        <h1>Step 1: Create User Group</h1>
        <p>Login and create a User Group</p>
        <p>
          The user group is where all members can collaborate and asses foods
          that might pose a risk of allergen contamination. Group members can
          review these common foods at any time.
        </p>
        <footer>
          <img src={stepOne} alt="Create a user group" />
          <figcaption>
            Please login using your Google credentials and begin by creating a
            new user group
          </figcaption>
        </footer>
      </article>
      <article>
        <h1>Step 2: Establish Purpose</h1>
        <p>A summary of the user group is shown on the group dashboard</p>
        <p>
          The user group should have a more focused goal, such as assesing
          commong foods eaten by a specific person. Write about them here and
          list out the allergens of concern that group members should be on the
          lookout for.
        </p>
        <footer>
          <img src={stepTwo} alt="Establish about section" />
        </footer>
      </article>
      <article>
        <h1>Step 3: Assess Foods</h1>
        <p>
          Create a new food, where you assess the danger it might pose to the
          person of interest. All group members can add and edit foods and
          recipes as needed.
        </p>
        <footer>
          <img src={stepThree} alt="Assess some foods" />
          <figcaption>
            Foods are listed here and danger levels noted.
          </figcaption>
        </footer>
      </article>
      <article>
        <h6>
          Now you can come back often and reference recipes and food as
          necessary. Next time you wonder if a food might contain an allergen,
          refer back here for the assesment and if its not listed, add it to the
          list for future reference!
        </h6>
        <img src={stepFour} alt="Reference food list" />
      </article>
      <button
        onClick={() => {
          navigate(`${navPages.Login}`);
        }}
      >
        Login Now!
      </button>
    </main>
  );

  const loggedInView = (
    <>
      <MenuHeader home logoutButton />
      {pageView}
    </>
  );

  const loggedOutView = (
    <>
      <MenuHeader loginButton />
      {pageView}
    </>
  );

  const loadingView = (
    <>
      <MenuHeader />
      Loading...
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
