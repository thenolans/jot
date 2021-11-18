import { useAuth0 } from "@auth0/auth0-react";
import Button from "components/core/Button";
import DeleteButton from "components/core/DeleteButton";
import Icon, { ClosingTag, Logout, OpeningTag } from "components/core/Icon";
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
              <Icon icon={Logout} />
              <span>Logout</span>
            </Button>
          </div>
          <div className="py-4">
            <DeleteButton
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
              Delete my data
            </DeleteButton>
          </div>
        </div>
        <div className="text-gray-400 text-xs mt-8 space-y-1">
          <div className="flex items-center">
            <Icon size={16} icon={OpeningTag} />
            <span className="mr-1">
              Developed by{" "}
              <a
                rel="noreferrer"
                target="_blank"
                href="https://www.thenolans.io"
                className="text-primary-700 hover:underline"
              >
                The Nolans
              </a>{" "}
              &mdash; v{process.env.REACT_APP_VERSION}
            </span>
            <Icon size={16} icon={ClosingTag} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
