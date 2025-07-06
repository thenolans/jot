import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoutes, SSOContextProvider } from "@thenolans/nolan-ui";
import EditNote from "components/EditNote";
import LandingPage from "components/LandingPage";
import { ROUTE_PATHS } from "constants/urls";
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
            <Route path={ROUTE_PATHS.root} element={<LandingPage />} />
            <Route
              element={<ProtectedRoutes redirectPath={ROUTE_PATHS.root} />}
            >
              <Route path={ROUTE_PATHS.notes} element={<App />}>
                <Route path={ROUTE_PATHS.editNote} element={<EditNote />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SSOContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
