import {
  deleteList as deleteListApi,
  updateList as updateListApi,
} from "api/lists";
import DeleteButton from "components/core/DeleteButton";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import Urls from "constants/urls";
import useList from "hooks/useList";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { FormIds, List, ListFormData, QueryKeys } from "types";
import updateQueryCacheIfExists from "utils/updateQueryCacheIfExists";

import ListForm from "../ListForm";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  list: List;
  onUpdate: (list: List) => void;
};

export default function EditItemModal({ list, ...props }: Props) {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const { list: listData, updateList } = useList();

  async function handleSubmit(values: ListFormData) {
    setIsUpdating(true);

    const updatedList = await updateListApi(list._id, values);

    updateQueryCacheIfExists(
      queryClient,
      QueryKeys.LISTS_LIST,
      (lists: List[]) =>
        lists.map((l) => {
          if (l._id === list._id) {
            return updatedList;
          }
          return l;
        })
    );

    updateQueryCacheIfExists(queryClient, ["list", list._id], (list: List) => ({
      ...list,
      ...updatedList,
    }));

    updateList({ ...listData, ...updatedList });
    setIsUpdating(false);
    props.onUpdate(updatedList);
    props.onClose();
  }

  async function deleteList() {
    if (window.confirm("Are you sure you want to delete this list?")) {
      await deleteListApi(list._id);

      updateQueryCacheIfExists(
        queryClient,
        QueryKeys.LISTS_LIST,
        (lists: List[]) => lists.filter((l) => l._id !== list._id)
      );

      history.push(Urls.routes["lists:list"]);
    }
  }

  return (
    <Modal ariaLabel="Edit list" title="Edit list" {...props}>
      <Modal.Body>
        <ListForm
          formId={FormIds.EDIT_LIST}
          initialData={list}
          onSubmit={handleSubmit}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="grid grid-cols-2 gap-2">
          <DeleteButton onClick={() => deleteList()} fluid>
            Delete list
          </DeleteButton>
          <SubmitButton
            isSubmitting={isUpdating}
            formId={FormIds.EDIT_LIST}
            fluid
          >
            Save list
          </SubmitButton>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
