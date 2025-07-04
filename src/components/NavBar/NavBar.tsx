import { AccountDropdown, useSSO } from "@thenolans/nolan-ui";
import NoteSearch from "components/NoteSearch";

export default function NavBar() {
  const { logout } = useSSO();

  return (
    <div className="flex justify-between items-center">
      <NoteSearch />
      <AccountDropdown>
        <AccountDropdown.Button onClick={() => logout(window.location.href)}>
          Logout
        </AccountDropdown.Button>
      </AccountDropdown>
    </div>
  );
}
