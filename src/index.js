import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "../node_modules/@picocss/pico/css/pico.css";
import "./index.scss";

//light and dark theme from pico.css
const root = ReactDOM.createRoot(document.getElementById("root"));




root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
