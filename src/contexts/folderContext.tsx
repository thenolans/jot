import { useQuery } from "@tanstack/react-query";
import { fetchFolders } from "api/folders";
import { createContext, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Folder, FolderContext as FolderContextType, QueryKeys } from "types";

type Props = {
  children: ReactNode;
};

export const FolderContext = createContext<FolderContextType>({
  folders: [],
  isFetching: false,
});

export default function FolderContextProvider({ children }: Props) {
  const location = useLocation();
  const appliedFilters = location.search;
  const folderId = new URLSearchParams(appliedFilters).get("folder_id");

  const { data = [], isFetching } = useQuery<Folder[]>({
    queryKey: [QueryKeys.FOLDERS, folderId],
    queryFn: fetchFolders,
  });

  return (
    <FolderContext.Provider
      value={{
        folders: data,
        isFetching,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}
