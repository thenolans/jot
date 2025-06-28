import { useSSO, AccountDropdown } from "@thenolans/nolan-ui";

export default function NavBar() {
  const { logout } = useSSO();

  return (
    <div className="flex justify-between items-center">
      <h1>Jot</h1>
      <AccountDropdown>
        <AccountDropdown.Button onClick={() => logout(window.location.href)}>
          Logout
        </AccountDropdown.Button>
      </AccountDropdown>
    </div>
  );
}
