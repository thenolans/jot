import classNames from "classnames";
import { marked } from "marked";

type Props = {
  content: string;
  className?: string;
};

export default function Note({ content, className }: Props) {
  function createMarkup() {
    return {
      __html: marked.parse(content),
    };
  }

  return (
    <div
      className={classNames(
        "border-2 text-sm sm:text-base border-gray-100 text-gray-600 rounded-xl p-3 sm:p-6 bg-white mb-4",
        className
      )}
    >
      <div
        className="u-markdown space-y-4"
        // @ts-expect-error
        dangerouslySetInnerHTML={createMarkup()}
      />
    </div>
  );
}
