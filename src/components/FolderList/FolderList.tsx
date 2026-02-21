import Folder from "components/Folder";
import { ROUTE_PATHS } from "constants/urls";
import useFolders from "hooks/useFolders";
import { reverse } from "named-urls";
import { Link } from "react-router-dom";

export default function FolderList() {
  const { folders, isFetching } = useFolders();

  return (
    <div className="grid grid-cols-4 gap-4">
      {folders.map((folder) => {
        return (
          <Link
            to={`${reverse(ROUTE_PATHS.notes)}?folder_id=${folder.id}`}
            key={folder.id}
          >
            <Folder folder={folder} />
          </Link>
        );
      })}
    </div>
  );
}
