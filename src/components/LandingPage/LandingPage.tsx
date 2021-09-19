import { useAuth0 } from "@auth0/auth0-react";
import Button from "components/Button";
import Container from "components/Container";
import Entry from "components/Entry";
import Input from "components/Input";
import Label from "components/Label";
import Urls from "constants/urls";
import dayjs from "dayjs";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Entry as EntryType } from "types";

const SAMPLE_TAGS = {
  coffee: {
    _id: "coffee",
    name: "Coffee",
  },
  beer: {
    _id: "beer",
    name: "Beer",
  },
  cider: {
    _id: "cider",
    name: "Cider",
  },
};

const SAMPLE_ENTRIES: EntryType[] = [
  {
    _id: "1",
    title: "City of Saints Coffee Roasters",
    notes:
      "The Citizen Blend was easily the smoothest coffee we've ever drank.",
    date: dayjs().subtract(3, "day").toDate(),
    tags: [SAMPLE_TAGS.coffee],
  },
  {
    _id: "2",
    title: "Bold Rock: Watermelon",
    notes:
      "There really wasn't much watermelon flavor, so wouldn't really recommend buying again",
    date: dayjs().subtract(3, "day").toDate(),
    tags: [SAMPLE_TAGS.cider],
  },
  {
    _id: "2",
    title: "Flat Rock: Tropical Pineapple",
    notes: "Tasted pretty similar to a melted piña colada!",
    date: dayjs().subtract(3, "day").toDate(),
    tags: [SAMPLE_TAGS.cider],
  },
];

export default function LandingPage() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const history = useHistory();
  const [keyword, setKeyword] = useState("");

  return (
    <div className="pb-20">
      <Container>
        <div className="text-center space-y-8 py-8 text-gray-700">
          <h1 className="font-display text-center text-6xl text-yellow-600">
            Jot
          </h1>
          <p>
            Keep track of anything you can imagine by jotting down notes that
            can be easily found by searching and filtering
          </p>
          {isAuthenticated ? (
            <Button onClick={() => history.push(Urls.routes.app)}>
              Go to app
            </Button>
          ) : (
            <div className="space-x-4">
              <Button onClick={() => loginWithRedirect()}>Login</Button>
              <Button
                onClick={() =>
                  loginWithRedirect({
                    screen_hint: "signup",
                  })
                }
                theme="secondary"
              >
                Sign up
              </Button>
            </div>
          )}
          <hr />
          <h3 className="text-2xl text-yellow-600">Check it out!</h3>
          <p>
            Below are some entries that have been logged that can be searched by
            keyword or filtered by tags.
          </p>
          <div className="text-left space-y-4">
            <div>
              <Label htmlFor="sample-filter">Filter by keyword</Label>
              <Input
                id="sample-filter"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            {SAMPLE_ENTRIES.filter(
              (entry) =>
                entry.notes?.toLowerCase()?.includes(keyword.toLowerCase()) ||
                entry.title.toLowerCase().includes(keyword.toLowerCase())
            ).map((entry) => {
              return (
                <Entry
                  highlightTerm={keyword}
                  canEdit={false}
                  data={entry}
                  key={entry._id}
                />
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
