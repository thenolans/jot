const Urls = {
  routes: {
    root: "/",
    app: "/app",
    account: "/account",
    "journal:list": "/journals",
    "journal:details": "/journals/:id",
    "notes:list": "/notes",
    "lists:list": "/lists",
    "list:details": "/lists/:id",
    "list:add": "/lists/add",
  },
  api: {
    entries: "/jot/entries",
    entry: "/jot/entries/:id",
    tags: "/jot/tags",
    account: "/account",
    "journals:list": "/jot/journals",
    "journal:details": "/jot/journals/:id",
    "journal:entries": "/jot/journals/:id/entries",
    "journal:entry": "/jot/journals/:journalId/entries/:entryId",
    "listGroups:list": "/jot/list-groups",
    "listGroups:reorder": "/jot/list-groups/reorder",
    "listGroup:details": "/jot/list-groups/:id",
    "listItem:details": "/jot/list-items/:id",
    "listItems:list": "/jot/list-items",
    "listItems:reorder": "/jot/list-items/reorder",
    "lists:list": "/jot/lists",
    "list:details": "/jot/lists/:id",
  },
};

export default Urls;
