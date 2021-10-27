import { Auth0Provider } from "@auth0/auth0-react";
import Urls from "constants/urls";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  return (
    <Auth0Provider
      audience={process.env.REACT_APP_AUTH0_AUDIENCE!}
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      redirectUri={`${window.location.origin}${Urls.routes.app}`}
      // Cookies were an issue with Brave and some other browsers
      // so switched to local storage
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
