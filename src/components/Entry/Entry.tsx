import Highlighter from "components/Highlighter";
import dayjs from "dayjs";
import { Entry as EntryType } from "types";

type Props = {
  data: EntryType;
  highlightTerm?: string;
};

export default function Entry({ data, highlightTerm = "" }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div>
        <h3 className="font-semibold">
          <Highlighter
            autoEscape
            highlightClassName="tw-bg-sandy-beach p-0"
            searchWords={[highlightTerm]}
            textToHighlight={data.title}
          />
        </h3>
      </div>
      {data.notes && (
        <div className="text-sm">
          <Highlighter
            autoEscape
            highlightClassName="tw-bg-sandy-beach p-0"
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
