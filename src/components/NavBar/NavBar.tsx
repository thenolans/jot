import { AccountDropdown, useSSO } from "@thenolans/nolan-ui";

export default function NavBar() {
  const { logout } = useSSO();

  return (
    <div className="w-full bg-white sticky top-0 z-20 border-b-2 border-gray-100">
      <div className="flex items-center justify-between h-16 max-w-5xl mx-auto pr-2 pl-4">
        <h1 className="font-display font-semibold text-4xl text-primary-800 text-center">
          Jot
        </h1>
        <AccountDropdown>
          <AccountDropdown.Button onClick={() => logout(window.location.href)}>
            Logout
          </AccountDropdown.Button>
        </AccountDropdown>
      </div>
    </div>
  );
}
