import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "../firebase_setup/firebase";
import { signInWithPopup } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import MenuHeader from "../components/MenuHeader";
import "./Login.scss";
import navPages from "../nav-directory";

const Login = () => {
  const navigate = useNavigate();

  const logUserIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // console.log(result.user);
        const userRef = doc(db, 'users', `${result.user.email}`);
        console.log(userRef);
        setDoc(
          userRef,
          {
            id: result.user.uid,
            email: result.user.email,
            lastLogin: Date(),
          },
          { merge: true }
        ).catch((error) => {
          alert(`DB error: ${error}`);
          navigate(`${navPages.Main}`);
        });
        return result;
      })
      .then((result) => {
        navigate(`${navPages.Home(result.user.uid)}`);
      })
      .catch((error) => {
        alert(`Login Error: ${error}`);
        navigate(`${navPages.Main}`);
      });
  };

  return (
    <>
      <MenuHeader pages={["About"]} />
      <main className="container login-container">
        <div className="login">
          <h3>Sign In With Google to Continue</h3>
          <button onClick={logUserIn}>Log In</button>
        </div>
      </main>
    </>
  );
};

export default Login;
