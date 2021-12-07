import { updateList as updateListApi } from "api/lists";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import useList from "hooks/useList";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { FormIds, List, ListFormData, QueryKeys } from "types";
import updateQueryCacheIfExists from "utils/updateQueryCacheIfExists";

import ListForm from "../ListForm";

type Props = Pick<ModalProps, "onClose" | "isOpen"> & {
  list: List;
  onUpdate: (list: List) => void;
};

export default function EditItemModal({ list, ...props }: Props) {
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

  return (
    <Modal ariaLabel="Edit list" title="Edit list" {...props}>
      <Modal.Body>
        <ListForm
          formId={FormIds.EDIT_LIST}
          initialData={list}
          onSubmit={handleSubmit}
        />
      </Modal.Body>
      <Modal.Footer className="text-right">
        <SubmitButton isSubmitting={isUpdating} formId={FormIds.EDIT_LIST}>
          Save list
        </SubmitButton>
      </Modal.Footer>
    </Modal>
  );
}
