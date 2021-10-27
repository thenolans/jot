import { useAuth0 } from "@auth0/auth0-react";
import Urls from "constants/urls";
import { ComponentType } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

type Props = RouteProps & { component: ComponentType<any> };

const ProtectedRoute = ({ component: Component, ...routeProps }: Props) => {
  const { isAuthenticated } = useAuth0();

  return (
    <Route
      {...routeProps}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={Urls.routes.root} />
        )
      }
    />
  );
};

export default ProtectedRoute;
