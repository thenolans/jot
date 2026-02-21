import Folder from "components/Folder";
import { ROUTE_PATHS } from "constants/urls";
import useFolders from "hooks/useFolders";
import { reverse } from "named-urls";
import { Link } from "react-router-dom";

export default function FolderList() {
  const { folders, isFetching } = useFolders();

  if (!folders && !isFetching) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 sm:gap-4">
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
