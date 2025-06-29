import { marked } from "marked";

type Props = {
  content: string;
};

export default function Note({ content }: Props) {
  function createMarkup() {
    return {
      __html: marked.parse(content),
    };
  }

  return (
    <div className="border-2 border-gray-100 text-gray-600 rounded-xl p-6 bg-white mb-4 shadow-lg transition-all hover:shadow-xl hover:border-primary-800">
      <div
        className="u-markdown space-y-4"
        // @ts-expect-error
        dangerouslySetInnerHTML={createMarkup()}
      />
    </div>
  );
}
