import {
  BuiltByTheNolans,
  Button,
  Icon,
  useRedirectIfAuthenticated,
  useSSO,
} from "@thenolans/nolan-ui";
import GitHubLink from "components/GitHubLink";
import Note from "components/Note";
import NoteEditor from "components/NoteEditor";
import { ROUTE_PATHS } from "constants/urls";
import { useState } from "react";

const DEMO_MARKDOWN = `# Jot

A dead-simple, markdown note taking application. It currently supports the following elements:

1. Heading
1. Ordered lists
1. Unordered lists
1. Anchors
1. Tables
1. Dividers
1. **Bold** and _italics_

---

Test it out by modifying this markdown!`;

const NOTE = {
  content: DEMO_MARKDOWN,
  id: 1,
  created_at: "2025-07-19 13:10:23.499315-04",
  updated_at: "2025-07-19 13:10:23.499315-04",
  is_pinned: false,
};

export default function LandingPage() {
  const { redirectToLogin, redirectToRegister } = useSSO();

  const [demoMarkdown, setDemoMarkdown] = useState(DEMO_MARKDOWN);
  useRedirectIfAuthenticated(ROUTE_PATHS.notes);

  return (
    <div className="flex min-h-screen items-center justify-center flex-col py-8">
      <div className="space-y-8">
        <h1 className="font-display font-semibold text-6xl text-primary-700 text-center">
          Jot
        </h1>
        <div className="flex items-center  space-x-4 justify-center">
          <Button onClick={() => redirectToLogin(window.location.href)}>
            Log in
          </Button>
          <Button
            theme="secondary"
            onClick={() => redirectToRegister(window.location.href)}
          >
            Create account
          </Button>
        </div>
        <div className="flex items-stretch max-w-2xl gap-2 px-2">
          <div className="flex-1 relative">
            <NoteEditor
              defaultContent={demoMarkdown}
              className="u-hide-scrollbar absolute resize-none scroll text-gray-600 text-sm w-full min-h-full h-full max-h-full bg-white border-2 rounded-xl border-transparent shadow p-4  focus:border-primary-800 overflow-scroll outline-none hover:border-primary-300 leading-snug"
              onChange={(content) => setDemoMarkdown(content)}
            />
          </div>
          <div className="px-2 text-primary-700 sm:flex items-center hidden">
            <Icon icon="ArrowRight" />
          </div>
          <div className="flex-1">
            <Note isDemo note={NOTE} className="h-full" />
          </div>
        </div>

        <BuiltByTheNolans />
      </div>
      <GitHubLink />
    </div>
  );
}
