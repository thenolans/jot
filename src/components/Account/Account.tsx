import { useAuth0 } from "@auth0/auth0-react";
import Button from "components/Button";
import Layout from "components/Layout";
import Urls from "constants/urls";
import http from "utils/http";

export default function Account() {
  const { logout } = useAuth0();

  return (
    <Layout>
      <div className="grid grid-cols-1 divide-y divide-gray-300">
        <div className="py-4">
          <Button
            className="space-x-2"
            onClick={() =>
              logout({
                returnTo: window.location.origin,
              })
            }
            theme="mutedLink"
          >
            <i aria-hidden="true" className="fa fa-power-off" />
            <span>Logout</span>
          </Button>
        </div>
        <div className="py-4">
          <Button
            className="space-x-2"
            theme="dangerLink"
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to delete your data? This action cannot be undone!"
                )
              ) {
                await http.delete(`${Urls.api.account}?jot=true`);
                logout({
                  returnTo: window.location.origin,
                });
              }
            }}
          >
            <i aria-hidden="true" className="fa fa-trash" />
            <span>Delete my data</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
