import BodyText from "components/core/BodyText";
import Button from "components/core/Button";
import Checkbox from "components/core/Checkbox";
import Modal, { ModalProps } from "components/core/Modal";
import SubmitButton from "components/core/SubmitButton";
import Urls from "constants/urls";
import { useState } from "react";
import { useQueryClient } from "react-query";
import http from "utils/http";

type Props = Pick<ModalProps, "onClose" | "isOpen">;

enum DataOptions {
  NOTES = "notes",
  JOURNALS = "journals",
  LISTS = "lists",
}

export default function GenerateDataConfirmation(props: Props) {
  const queryClient = useQueryClient();
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<DataOptions[]>([
    DataOptions.NOTES,
    DataOptions.JOURNALS,
    DataOptions.LISTS,
  ]);

  function toggleOption(option: DataOptions) {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  }

  async function generateSampleData() {
    setIsGeneratingData(true);

    try {
      await http.post(Urls.api["account:sample-data"], {
        modules: selectedOptions,
      });

      queryClient.clear();
      props.onClose();
    } catch {
      // TODO: Handle error
    } finally {
      setIsGeneratingData(false);
    }
  }

  return (
    <Modal
      title="Generate sample data"
      ariaLabel="Generate sample data"
      {...props}
    >
      <Modal.Body>
        <div className="space-y-8">
          <BodyText>
            Sample data can give you a quick look at how Jot can be used. For
            which modules would you like to generate sample data?
          </BodyText>
          <div className="space-y-1">
            <Checkbox
              checked={selectedOptions.includes(DataOptions.NOTES)}
              onChange={() => toggleOption(DataOptions.NOTES)}
              label="Notes"
            />
            <Checkbox
              checked={selectedOptions.includes(DataOptions.JOURNALS)}
              onChange={() => toggleOption(DataOptions.JOURNALS)}
              label="Journals"
            />
            <Checkbox
              checked={selectedOptions.includes(DataOptions.LISTS)}
              onChange={() => toggleOption(DataOptions.LISTS)}
              label="Lists"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => props.onClose()} theme="link-muted">
            Cancel
          </Button>
          <SubmitButton
            isSubmitting={isGeneratingData}
            onClick={() => generateSampleData()}
            type="button"
          >
            Generate
          </SubmitButton>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
