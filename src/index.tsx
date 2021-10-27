import "./index.css";

import AuthProvider from "components/auth/AuthProvider";
import App from "components/modules/app";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
