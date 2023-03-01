import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Groups from "../components/Groups";
import MenuHeader from "../components/MenuHeader";
import { auth } from "../firebase_setup/firebase";
import navPages from "../nav-directory";
import { onAuthStateChanged } from "firebase/auth";
import "./Home.scss";
import Disclaimer from "../components/Disclaimer";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  let { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (userFetched) => {
      if (userFetched && userFetched.uid === userId) {
        setUser(userFetched);
        setIsLoading(false);
      } else {
        navigate(`${navPages.Main}`);
      }
    });
  }, [navigate, userId]);

  const homePage = (user) => {
    return (
      <>
        <MenuHeader pages={["About"]} logoutButton />
        <main className="container home">
        <Disclaimer/>
          <article>
            <h4>Welcome to Magic Meals!</h4>
            <footer className="home-welcome-footer">
              <h6>Logged in as: </h6>
              {user.email}
            </footer>
          </article>
          <Groups user={user} />
        </main>
      </>
    );
  };

  const loading = (
    <>
      <MenuHeader />
      <LoadingSpinner/>
    </>
  );

  return isLoading ? loading : homePage(user);
};

export default Home;
