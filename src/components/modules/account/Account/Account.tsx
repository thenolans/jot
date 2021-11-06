import { useAuth0 } from "@auth0/auth0-react";
import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Urls from "constants/urls";
import http from "utils/http";

export default function Account() {
  const { logout } = useAuth0();

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Account</PageTitle>
        </div>
        <div className="divide-y divide-gray-300 px-2">
          <div className="py-4">
            <Button
              onClick={() =>
                logout({
                  returnTo: window.location.origin,
                })
              }
              theme="link--muted"
            >
              <Icon variant="fa-power-off" />
              <span>Logout</span>
            </Button>
          </div>
          <div className="py-4">
            <Button
              theme="link--danger"
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
              <Icon variant="fa-trash" />
              <span>Delete my data</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
