import { useAuth0 } from "@auth0/auth0-react";
import AuthLoader from "components/AuthLoader";
import Dashboard from "components/Dashboard";
import JournalDetails from "components/JournalDetails";
import JournalList from "components/JournalList";
import LandingPage from "components/LandingPage";
import List from "components/List";
import Lists from "components/Lists";
import Notes from "components/Notes";
import ProtectedRoute from "components/ProtectedRoute";
import Urls from "constants/urls";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  const { isLoading } = useAuth0();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 1000 * 60 * 60 * 24,
      },
    },
  });

  if (isLoading) {
    // This state is rendered while Auth0 is determining whether
    // a session exists already or not
    return <AuthLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route exact path={Urls.routes.root} component={LandingPage} />
          <ProtectedRoute path={Urls.routes.app} component={Dashboard} />
          <ProtectedRoute
            exact
            path={Urls.routes["journal:list"]}
            component={JournalList}
          />
          <ProtectedRoute
            path={Urls.routes["journal:details"]}
            component={JournalDetails}
          />
          <ProtectedRoute
            exact
            path={Urls.routes["notes:list"]}
            component={Notes}
          />
          <ProtectedRoute
            exact
            path={Urls.routes["lists:list"]}
            component={Lists}
          />
          <ProtectedRoute
            exact
            path={Urls.routes["list:details"]}
            component={List}
          />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
