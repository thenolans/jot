import Button from "components/Button";
import Highlighter from "components/Highlighter";
import useEntries from "hooks/useEntries";
import { DialogKeys, Entry as EntryType } from "types";

type Props = {
  data: EntryType;
  highlightTerm?: string;
  canEdit?: boolean;
};

export default function Entry({
  data,
  highlightTerm = "",
  canEdit = true,
}: Props) {
  const { setActiveDialog, setEntryToEdit } = useEntries();

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          <Highlighter
            autoEscape
            searchWords={[highlightTerm]}
            textToHighlight={data.title}
          />
        </h3>
        {canEdit && (
          <Button
            theme="mutedLink"
            onClick={() => {
              setActiveDialog(DialogKeys.EDIT);
              setEntryToEdit(data);
            }}
          >
            <i aria-hidden="true" className="fa fa-pencil" />
            <span className="sr-only">Edit entry</span>
          </Button>
        )}
      </div>
      {data.notes && (
        <div className="text-sm whitespace-pre-wrap">
          <Highlighter
            autoEscape
            searchWords={[highlightTerm]}
            textToHighlight={data.notes}
          />
        </div>
      )}
      {!!data.tags.length && (
        <div className="flex flex-wrap">
          {data.tags.map((tag) => (
            <div
              key={tag._id}
              className="bg-gray-100 rounded px-2 py-1 text-xs my-1 mr-1"
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
