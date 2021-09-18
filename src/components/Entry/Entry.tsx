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
        <time
          className="text-sm text-gray-500"
          dateTime={dayjs(data.createdAt).format("YYYY-MM-DD")}
        >
          {dayjs(data.createdAt).format("MMM D, YYYY @ h:mma")}
        </time>
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
      <div className="flex space-x-2">
        {data.tags.map((tag) => (
          <div key={tag} className="bg-gray-100 rounded px-2 py-1 text-xs">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}
