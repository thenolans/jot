import Button from "components/Button";
import Container from "components/Container";
import Icon from "components/Icon";
import Input from "components/Input";
import ListTile from "components/ListTile";
import Urls from "constants/urls";
import useDebounce from "hooks/useDebounce";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import { List } from "types";
import http from "utils/http";

function fetchLists(): Promise<List[]> {
  return http.get(Urls.api["lists:list"]).then((res) => res.data.data);
}

export default function Lists() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const history = useHistory();
  const { data = [], isFetching } = useQuery(["lists"], () => fetchLists(), {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <Container>
      <div className="space-y-8 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl text-primary-700">Lists</h2>
          {!isFetching && !!data.length && (
            <Button
              onClick={() => {
                history.push(Urls.routes["list:add"]);
              }}
            >
              Add list
            </Button>
          )}
        </div>
        {isFetching && (
          <div className="text-center py-4 space-y-4">
            <Icon
              className="text-gray-300"
              variant="fa-circle-o-notch"
              size="fa-3x"
              spin
            />
            <div className="text-lg text-gray-500">Fetching lists...</div>
          </div>
        )}
        {!isFetching && !data.length && (
          <div className="text-center space-y-4">
            <Icon
              className="text-gray-300"
              variant="fa-list-alt"
              size="fa-3x"
            />
            <div className="text-lg text-gray-400">
              You have not created any lists, yet!
            </div>
            <Button
              onClick={() => {
                history.push(Urls.routes["list:add"]);
              }}
            >
              Add list
            </Button>
          </div>
        )}
        {!isFetching && !!data.length && (
          <>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a list"
            />
            <div className="grid grid-cols-2 rounded-3xl overflow-hidden">
              {data
                .filter((list) =>
                  list.name.toLowerCase().includes(debouncedQuery.toLowerCase())
                )
                .map((list) => {
                  return <ListTile list={list} key={list._id} />;
                })}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
