import Urls from "constants/urls";
import { stringifyUrl } from "query-string";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Response, Tag, TagTypes } from "types";
import http from "utils/http";

type TagContextType = {
  tags: Tag[];
  addTag: (tag: string) => Promise<Tag>;
  isFetching: boolean;
};

type Props = {
  children: ReactNode;
  type: TagTypes;
  typeId: string;
};

const TagContext = createContext<TagContextType>({
  tags: [],
  // @ts-expect-error
  addTag() {},
  isFetching: false,
});

function fetchTags(type: TagTypes, typeId: string): Promise<Response<Tag[]>> {
  return http
    .get(
      stringifyUrl({
        url: Urls.api.tags,
        query: {
          type,
          typeId,
        },
      })
    )
    .then((res) => res.data);
}

export const TagProvider = ({ children, type, typeId }: Props) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { data, isLoading: isFetching } = useQuery(["tags", type, typeId], () =>
    fetchTags(type, typeId)
  );

  useEffect(() => {
    if (data?.data?.length) {
      setTags(data.data);
    }
  }, [data]);

  async function addTag(tag: string): Promise<Tag> {
    const addedTag = await http.post<Response<Tag>>(Urls.api.tags, {
      name: tag,
      type,
      typeId,
    });
    setTags((prevTags) => [...prevTags, addedTag.data.data]);
    return addedTag.data.data;
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
