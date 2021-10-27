import { useAuth0 } from "@auth0/auth0-react";
import Button from "components/core/Button";
import Container from "components/core/Container";
import Logo from "components/core/Logo";
import Urls from "constants/urls";
import { useHistory } from "react-router-dom";

export default function LandingPage() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const history = useHistory();

  return (
    <Container>
      <div className="text-center space-y-8 py-8 text-gray-700">
        <Logo />
        <p>
          Keep track of anything you can imagine by jotting down notes that can
          be easily found by searching and filtering
        </p>
        {isAuthenticated ? (
          <Button onClick={() => history.push(Urls.routes.app)}>
            Go to app
          </Button>
        ) : (
          <div className="space-x-4">
            <Button onClick={() => loginWithRedirect()}>Login</Button>
            <Button
              onClick={() =>
                loginWithRedirect({
                  screen_hint: "signup",
                })
              }
              theme="secondary"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
