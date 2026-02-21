import { Card, Icon } from "@thenolans/nolan-ui";
import { Folder as FolderType } from "types";

type Props = {
  folder: FolderType;
};

export default function Folder({ folder }: Props) {
  return (
    <Card canClick>
      <div className="flex items-center">
        <div className="px-4">
          <div className="flex items-center space-x-4">
            <Icon className="text-primary-800" icon="Folder" />
            <div className="text-sm sm:text-base">{folder.name}</div>
          </div>
        </div>
        <div className="ml-auto w-12 h-12 text-sm text-primary-800 font-bold bg-primary-50 flex items-center justify-center">
          {folder.note_count}
        </div>
      </div>
    </Card>
  );
}
