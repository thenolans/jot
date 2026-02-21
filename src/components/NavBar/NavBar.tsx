import { AccountDropdown, useSSO } from "@thenolans/nolan-ui";
import { GITHUB_REPOSITORY_LINK } from "constants/defaults";
import { ROUTE_PATHS } from "constants/urls";
import { Link } from "react-router-dom";

export default function NavBar() {
  const { logout } = useSSO();

  return (
    <div className="w-full bg-white sticky top-0 z-20 shadow">
      <div className="flex items-center justify-between h-16 max-w-5xl mx-auto px-2">
        <Link to={ROUTE_PATHS.notes}>
          <h1 className="font-display font-semibold text-4xl text-primary-800 text-center pl-2">
            Jot
          </h1>
        </Link>
        <AccountDropdown>
          <AccountDropdown.Anchor href={process.env.REACT_APP_SSO_URL!}>
            Profile
          </AccountDropdown.Anchor>
          <AccountDropdown.Anchor
            href={GITHUB_REPOSITORY_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repo
          </AccountDropdown.Anchor>
          <AccountDropdown.Divider />
          <AccountDropdown.Button onClick={() => logout(window.location.href)}>
            Logout
          </AccountDropdown.Button>
        </AccountDropdown>
      </div>
    </div>
  );
}
