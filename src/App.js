import { Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./App.scss";
import navPages from "./nav-directory";
import GroupDashboard from "./pages/GroupDashboard";

function App() {
  //controls the lights theme
  const rootElement = document.documentElement;
  let theme = localStorage.getItem("theme");
  const [lights, setLights] = useState(theme);

  if (theme === null) {
    localStorage.setItem("theme", "dark");
    theme = "dark";
    setLights(theme);
  }

  rootElement.setAttribute("data-theme", theme);

  const toggleLights = () => {
    if (theme === "light") {
      localStorage.setItem("theme", "dark");
      setLights("dark");
    } else {
      localStorage.setItem("theme", "light");
      setLights("light");
    }
  };

  return (
    <>
      <Routes>
        <Route exact path={navPages.Main} element={<Main />} />
        <Route exact path={navPages.Login} element={<Login />} />
        <Route exact path={navPages.Home(":userId")} element={<Home />} />
        <Route
          exact
          path={navPages.Group(":userId", ":groupId")}
          element={<GroupDashboard />}
        />
        <Route path="*" element={<Navigate to={navPages.Main} replace />} />
      </Routes>
      <footer className="page-footer">
        <div>
          Built by{" "}
          <a
            href="https://github.com/mv805/magic-meals"
            target="_blank"
            rel="noreferrer"
          >
            Matt Villa.
          </a>
          &nbsp; All rights Reserved.
        </div>
        <label htmlFor="switch-1">
          <input
            type="checkbox"
            id="switch-1"
            name="switch-1"
            role="switch"
            checked={lights === "dark" ? false : true}
            onChange={toggleLights}
          />
          Lights
        </label>
      </footer>
    </>
  );
}

export default App;
