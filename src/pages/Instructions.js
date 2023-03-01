import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import stepOne from "../assets/step-1.PNG";
import stepTwo from "../assets/step-2.PNG";
import stepThree from "../assets/step-3.PNG";
import stepFour from "../assets/step-4.PNG";
import LoadingSpinner from "../components/LoadingSpinner";
import MenuHeader from "../components/MenuHeader";
import { auth } from "../firebase_setup/firebase";

const Instructions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

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
    <main className="container">
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
        <footer className="figure">
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
        <footer className="figure">
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
        <footer className="figure">
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
    </main>
  );

  const loggedInView = (
    <>
      <MenuHeader home pages={["About"]} logoutButton />
      {pageView}
    </>
  );

  const loggedOutView = (
    <>
      <MenuHeader pages={["About"]} loginButton />
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
  } else if (!isLoading && isLoggedIn) {
    return loggedInView;
  } else if (!isLoading && !isLoggedIn) {
    return loggedOutView;
  }
};

export default Instructions;
