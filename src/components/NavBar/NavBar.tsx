import { AccountDropdown, useSSO } from "@thenolans/nolan-ui";
import JotLogo from "assets/logo.svg";

export default function NavBar() {
  const { logout } = useSSO();

  return (
    <div className="w-full bg-white sticky top-0 z-20 border-b-2 border-gray-100">
      <div className="flex items-center justify-between h-16 max-w-5xl mx-auto px-2 sm:px-4">
        <img className="h-12" src={JotLogo} alt="Jot" />
        <AccountDropdown>
          <AccountDropdown.Button onClick={() => logout(window.location.href)}>
            Logout
          </AccountDropdown.Button>
        </AccountDropdown>
      </div>
    </div>
  );
}
