import "./JournalEntry.css";

import Tag from "components/Tag";

export default function JournalEntry() {
  return (
    <div className="c-journal-entry">
      <div className="c-journal-entry__date">
        <div>Jan</div>
        <div>1</div>
      </div>
      <div className="c-journal-entry__content">
        <h3 className="c-journal-entry__title">
          Wampa aayla dagobah jade maul binks sidious. Antilles jar fisto
          tatooine darth hutt.
        </h3>
        <div>
          Lucas ipsum dolor sit amet ackbar r2-d2 luke sebulba ackbar skywalker
          ackbar lars skywalker droid. Organa windu bothan droid kessel grievous
          skywalker gonk watto. Coruscant ponda qui-gon wedge solo mara darth
          greedo windu. Leia windu mon jade boba kenobi qui-gonn biggs.
        </div>
        <div className="c-journal-entry__tags">
          <Tag>Luke Skywalker</Tag>
          <Tag>Mandalorian</Tag>
        </div>
      </div>
    </div>
  );
}
