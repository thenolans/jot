import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Modal, { ModalProps } from "components/core/Modal";
import SROnly from "components/core/SROnly";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { List, ListFormData, QueryKeys } from "types";
import http from "utils/http";

import ListForm from "../ListForm";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  list: List;
  onUpdate: (list: List) => void;
};

async function saveListRequest(data: ListFormData, listId: string) {
  return http
    .patch(reverse(Urls.api["list:details"], { id: listId }), data)
    .then((res) => res.data.data);
}

export default function EditItemModal({ list, ...props }: Props) {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  async function saveList(values: ListFormData) {
    setIsSaving(true);

    const updatedList = await saveListRequest(values, list._id);

    setIsSaving(false);
    props.onUpdate(updatedList);
    props.onClose();
  }

  async function deleteList() {
    if (window.confirm("Are you sure you want to delete this list?")) {
      await http.delete(
        reverse(Urls.api["list:details"], {
          id: list._id,
        })
      );

      queryClient.setQueryData(QueryKeys.LISTS_LIST, (lists) =>
        // @ts-expect-error
        lists.filter((l) => l._id !== list._id)
      );
      history.push(Urls.routes["lists:list"]);
    }
  }

  return (
    <Modal ariaLabel="Edit list" title="Edit list" {...props}>
      <Modal.Body>
        <ListForm
          formId={`edit-list-${list._id}`}
          buttonLabel="Save list"
          initialData={list}
          isSubmitting={isSaving}
          onSubmit={saveList}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => deleteList()} theme="link--danger" fluid>
            <Icon variant="fa-trash" />
            <span> Delete list</span>
          </Button>
          <Button
            disabled={isSaving}
            type="submit"
            form={`edit-list-${list._id}`}
            fluid
          >
            {isSaving ? (
              <>
                <Icon variant="fa-circle-o-notch" spin />
                <SROnly>Saving...</SROnly>
              </>
            ) : (
              "Save list"
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
