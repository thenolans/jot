import { AccountDropdown, useSSO } from "@thenolans/nolan-ui";

export default function NavBar() {
  const { logout } = useSSO();

  return (
    <div className="w-full bg-white sticky top-0 z-20 border-b-2 border-gray-100">
      <div className="flex items-center justify-between h-16 max-w-5xl mx-auto px-2 sm:px-4">
        <div className="shrink-0 z-10 h-12 w-12 rounded-xl bg-emerald-800 text-white justify-center items-center flex">
          J
        </div>
        <AccountDropdown>
          <AccountDropdown.Button onClick={() => logout(window.location.href)}>
            Logout
          </AccountDropdown.Button>
        </AccountDropdown>
      </div>
    </div>
  );
}
