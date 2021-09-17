import { useAuth0 } from "@auth0/auth0-react";

export default function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
      type="button"
      onClick={() => logout()}
    >
      Logout
    </button>
  );
}
