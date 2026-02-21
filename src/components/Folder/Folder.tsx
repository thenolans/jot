import { Card, Icon } from "@thenolans/nolan-ui";
import { Folder as FolderType } from "types";

type Props = {
  folder: FolderType;
};

export default function Folder({ folder }: Props) {
  return (
    <div className="flex items-center space-x-4">
      <Icon className="text-primary-800 shrink-0" icon="Folder" />
      <span>{folder.name}</span>
    </div>
  );
}
