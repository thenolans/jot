import { useAuth0 } from "@auth0/auth0-react";
import AuthLoader from "components/auth/AuthLoader";
import ProtectedRoute from "components/auth/ProtectedRoute";
import Account from "components/modules/account/Account";
import JournalDetails from "components/modules/journals/JournalDetails";
import JournalList from "components/modules/journals/JournalList";
import List from "components/modules/lists/List";
import Lists from "components/modules/lists/Lists";
import LandingPage from "components/modules/marketing/LandingPage";
import Notes from "components/modules/notes/Notes";
import Urls from "constants/urls";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

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
          <Redirect path={Urls.routes.app} to={Urls.routes["notes:list"]} />
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
          <ProtectedRoute
            exact
            path={Urls.routes.account}
            component={Account}
          />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
