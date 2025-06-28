import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SSOContextProvider } from "@thenolans/nolan-ui";
import GitHubLink from "components/GitHubLink";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SSOContextProvider
        cookieDomain={process.env.REACT_APP_TOKEN_COOKIE_DOMAIN!}
        cookieName={process.env.REACT_APP_TOKEN_COOKIE_NAME!}
        apiBaseUrl={process.env.REACT_APP_API_BASE_URL!}
      >
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<App />} />
          </Routes>
        </BrowserRouter>
      </SSOContextProvider>
    </QueryClientProvider>
    <GitHubLink />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
