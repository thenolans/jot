import { Select } from "@thenolans/nolan-ui";
import Folder from "components/Folder";
import { ROUTE_PATHS } from "constants/urls";
import useFolders from "hooks/useFolders";
import { reverse } from "named-urls";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function FolderList() {
  const { folders, isFetching } = useFolders();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentFolderId = searchParams.get("folder_id");

  const options = [
    { value: "", label: "All Folders" },
    ...folders.map((folder) => ({
      value: String(folder.id),
      label: folder.name,
    })),
  ];

  const selectedOption =
    options.find((option) => option.value === (currentFolderId || "")) ||
    options[0];

  const handleSelectChange = (newValue: unknown, _actionMeta: unknown) => {
    const value = newValue as { value: string; label: string } | null;
    const newSearchParams = new URLSearchParams(searchParams);
    if (value?.value) {
      newSearchParams.set("folder_id", value.value);
    } else {
      newSearchParams.delete("folder_id");
    }
    navigate(`${reverse(ROUTE_PATHS.notes)}?${newSearchParams.toString()}`);
  };

  return (
    <div>
      <div className="block md:hidden p-4 sm:p-8">
        <Select
          value={selectedOption}
          onChange={handleSelectChange}
          options={options}
        />
      </div>
      <div className="hidden md:grid grid-cols-3 gap-4">
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
    </div>
  );
}
