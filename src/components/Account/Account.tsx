import { useAuth0 } from "@auth0/auth0-react";
import Container from "components/Container";
import Header from "components/Header";
import LogoutIcon from "components/LogoutIcon";
import TrashIcon from "components/TrashIcon";

export default function Account() {
  const { logout } = useAuth0();

  return (
    <Container>
      <Header />
      <div className="grid grid-cols-1 divide-y divide-gray-300">
        <div className="py-4">
          <button
            className="flex items-center space-x-2 text-gray-700 hover:text-yellow-700 font-semibold"
            onClick={() =>
              logout({
                returnTo: window.location.origin,
              })
            }
            type="button"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
        <div className="py-4">
          <button
            className="flex items-center space-x-2 text-red-700 font-semibold"
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to delete your data? This action cannot be undone!"
                )
              ) {
                // await deleteAccount();
                logout({
                  returnTo: window.location.origin,
                });
              }
            }}
          >
            <TrashIcon />
            <span>Delete my data</span>
          </button>
        </div>
      </div>
    </Container>
  );
}
