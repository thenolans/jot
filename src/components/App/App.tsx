import { useAuth0 } from "@auth0/auth0-react";
import Dashboard from "components/Dashboard";
import LandingPage from "components/LandingPage";
import ProtectedRoute from "components/ProtectedRoute";
import Urls from "constants/urls";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    // This state is rendered while Auth0 is determining whether
    // a session exists already or not
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route exact path={Urls.routes.root} component={LandingPage} />
          <ProtectedRoute path={Urls.routes.app} component={Dashboard} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
