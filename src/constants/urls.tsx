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
    "notes:list": "/jot/notes",
    "notes:details": "/jot/notes/:id",
    // List module
    "lists:lists": "/jot/lists",
    "lists:list": "/jot/lists/:id",
    "lists:list:reset": "/jot/lists/:id/reset",
    "lists:groups": "/jot/list-groups",
    "lists:groups:reorder": "/jot/list-groups/reorder",
    "lists:group": "/jot/list-groups/:id",
    "lists:items": "/jot/list-items",
    "lists:items:reorder": "/jot/list-items/reorder",
    "lists:item": "/jot/list-items/:id",
  },
};

export default Urls;
