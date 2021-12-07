import { useAuth0 } from "@auth0/auth0-react";
import Button from "components/core/Button";
import ConfirmModal from "components/core/ConfirmModal";
import DeleteButton from "components/core/DeleteButton";
import Icon, {
  ClosingTag,
  HardDrive,
  Logout,
  OpeningTag,
} from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Urls from "constants/urls";
import { useState } from "react";
import http from "utils/http";

import GenerateDataModal from "./GenerateDataModal";

export default function Account() {
  const { logout } = useAuth0();
  const [isShowingSampleDataModal, setIsShowingSampleDataModal] =
    useState(false);
  const [isConfirmingAccountDelete, setIsConfirmingAccountDelete] =
    useState(false);

  async function deleteAccount() {
    await http.delete(`${Urls.api.account}?jot=true`);

    logout({
      returnTo: window.location.origin,
    });
  }

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Account</PageTitle>
        </div>
        <div className="divide-y divide-gray-300 px-2">
          <div className="py-4">
            <Button
              theme="link-primary"
              onClick={() => setIsShowingSampleDataModal(true)}
            >
              <Icon icon={HardDrive} />
              <span>Generate sample data</span>
            </Button>
          </div>
          <div className="py-4">
            <Button
              onClick={() =>
                logout({
                  returnTo: window.location.origin,
                })
              }
              theme="link-primary"
            >
              <Icon icon={Logout} />
              <span>Logout</span>
            </Button>
          </div>
          <div className="py-4">
            <DeleteButton onClick={() => setIsConfirmingAccountDelete(true)}>
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
                className="text-primary-600 hover:underline"
              >
                The Nolans
              </a>{" "}
              &mdash; v{process.env.REACT_APP_VERSION}
            </span>
            <Icon size={16} icon={ClosingTag} />
          </div>
        </div>
      </div>

      {/*Modals*/}
      <GenerateDataModal
        isOpen={isShowingSampleDataModal}
        onClose={() => setIsShowingSampleDataModal(false)}
      />
      <ConfirmModal
        theme="danger"
        typeConfirm="Confirm"
        ariaLabel="Confirm account delete"
        isOpen={isConfirmingAccountDelete}
        onClose={() => setIsConfirmingAccountDelete(false)}
        onConfirm={() => deleteAccount()}
        title="Are you sure you want to delete your account?"
        description="This is a destruction action that removes all of your data and cannot be undone."
      />
    </Layout>
  );
}
