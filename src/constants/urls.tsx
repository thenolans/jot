const Urls = {
  routes: {
    root: "/",
    app: "/app",
    account: "/account",
    "journal:list": "/journals",
    "journal:details": "/journals/:id",
    "notes:list": "/notes",
    "lists:list": "/lists",
  },
  api: {
    entries: "/jot/entries",
    entry: "/jot/entries/:id",
    tags: "/jot/tags",
    account: "/account",
    "journals:list": "/jot/journals",
    "journal:details": "/jot/journals/:id",
    "journal:entries": "/jot/journals/:id/entries",
  },
};

export default Urls;
