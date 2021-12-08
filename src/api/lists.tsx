import Urls from "constants/urls";
import { reverse } from "named-urls";
import { stringifyUrl } from "query-string";
import { List, ListGroup, ListItem } from "types";
import http from "utils/http";

export async function getLists(q: string): Promise<List[]> {
  return http
    .get(stringifyUrl({ url: Urls.api["lists:lists"], query: { q } }))
    .then((res) => res.data.data);
}

export async function createList(
  data: Omit<List, "_id" | "groups" | "itemCount">
) {
  return http.post(Urls.api["lists:lists"], data).then((res) => res.data.data);
}

export function getList(listId: string): Promise<List> {
  return http
    .get(reverse(Urls.api["lists:list"], { id: listId }))
    .then((res) => res.data.data);
}

export async function updateList(listId: string, data: Partial<List>) {
  return http
    .patch(reverse(Urls.api["lists:list"], { id: listId }), data)
    .then((res) => res.data.data);
}

export async function resetList(listId: string) {
  return http.post(reverse(Urls.api["lists:list:reset"], { id: listId }));
}

export async function deleteList(listId: string) {
  return http.delete(
    reverse(Urls.api["lists:list"], {
      id: listId,
    })
  );
}

export async function createGroup(data: Omit<ListGroup, "_id" | "items">) {
  return http.post(Urls.api["lists:groups"], data).then((res) => res.data.data);
}

export async function updateGroup(groupId: string, data: Partial<ListGroup>) {
  return http
    .patch(reverse(Urls.api["lists:group"], { id: groupId }), data)
    .then((res) => res.data.data);
}

export async function deleteGroup(groupId: string) {
  return http.delete(reverse(Urls.api["lists:group"], { id: groupId }));
}

export async function reorderGroups(groups: ListGroup[]) {
  return http.post(
    Urls.api["lists:groups:reorder"],
    groups.map((g) => ({ id: g._id, sortOrder: g.sortOrder }))
  );
}

export async function createItem(data: Omit<ListItem, "_id">) {
  return http.post(Urls.api["lists:items"], data).then((res) => res.data.data);
}

export async function updateItem(itemId: string, data: Partial<ListItem>) {
  return http
    .patch(reverse(Urls.api["lists:item"], { id: itemId }), data)
    .then((res) => res.data.data);
}

export async function deleteItem(itemId: string) {
  return http.delete(reverse(Urls.api["lists:item"], { id: itemId }));
}

export async function reorderItems(items: ListItem[]) {
  return http.post(
    Urls.api["lists:items:reorder"],
    items.map((item) => ({
      id: item._id,
      sortOrder: item.sortOrder,
      groupId: item.groupId,
    }))
  );
}
