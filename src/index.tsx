import "./index.css";
import "react-tippy/dist/tippy.css";

import AuthProvider from "components/auth/AuthProvider";
import App from "components/modules/app";
import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
