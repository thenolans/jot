import Urls from "constants/urls";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Response, Tag } from "types";
import http from "utils/http";

type TagContextType = {
  tags: Tag[];
  addTag: (tag: string) => void;
  isFetching: boolean;
};

const TagContext = createContext<TagContextType>({
  tags: [],
  addTag() {},
  isFetching: false,
});

function fetchTags(): Promise<Response<Tag[]>> {
  return http.get(Urls.api.tags).then((res) => res.data);
}

export const TagProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { data, isLoading: isFetching } = useQuery(
    ["tags"],
    () => fetchTags(),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (data?.data?.length) {
      setTags(data.data);
    }
  }, [data]);

  async function addTag(tag: string) {
    try {
      const newTag = await http.post<Response<Tag>>(Urls.api.tags, {
        name: tag,
      });
      setTags((prevTags) => [...prevTags, newTag.data.data]);
    } catch {
      // TODO
    }
  }

  return (
    <TagContext.Provider
      value={{
        tags,
        addTag,
        isFetching,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export default TagContext;
