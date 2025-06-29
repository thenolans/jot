import {
  BuiltByTheNolans,
  Button,
  Icon,
  useRedirectIfAuthenticated,
  useSSO,
} from "@thenolans/nolan-ui";
import JotLogo from "assets/logo.svg";
import Note from "components/Note";
import Textarea from "components/Textarea";
import { ROUTE_PATHS } from "constants/urls";
import { useState } from "react";

const DEMO_MARKDOWN = `# Jot

A dead-simple, markdown note taking application. It currently supports the following elements:

1. Headings
1. Ordered lists
1. Unordered lists
1. Anchors
1. Tables
1. Dividers

---

Test it out by modifying this markdown!
`;

export default function LandingPage() {
  const { redirectToLogin, redirectToRegister } = useSSO();

  const [demoMarkdown, setDemoMarkdown] = useState(DEMO_MARKDOWN);
  useRedirectIfAuthenticated(ROUTE_PATHS.notes);

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <div className="space-y-8">
        <img className="w-12 mx-auto" src={JotLogo} alt="Jot" />
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
            <Textarea
              value={demoMarkdown}
              onChange={(e) => setDemoMarkdown(e.target.value)}
            />
          </div>
          <div className="px-2 text-primary-800 sm:flex items-center hidden">
            <Icon icon="ArrowRight" />
          </div>
          <div className="flex-1">
            <Note className="h-full" content={demoMarkdown} />
          </div>
        </div>
        <BuiltByTheNolans />
      </div>
    </div>
  );
}
