// Vite's dep-optimizer can emit react-dom/client with only a default export,
// so a named { createRoot } import resolves to undefined and the app never
// mounts. Importing the default (the client module namespace) is safe either way.
import ReactDOMClient from "react-dom/client";
import React from "react";
import App from "./App.jsx";
import "./styles.css";

const createRoot = ReactDOMClient.createRoot || ReactDOMClient;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
