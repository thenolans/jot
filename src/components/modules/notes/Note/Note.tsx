import "./Note.css";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  onClick: () => void;
};

export default function Note({ content, onClick }: Props) {
  return (
    <div role="button" className="c-note" onClick={onClick}>
      <ReactMarkdown children={content} />
    </div>
  );
}
