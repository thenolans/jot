import { FolderContext } from "contexts/folderContext";
import { useContext } from "react";

export const useFolders = () => useContext(FolderContext);

export default useFolders;
