import { marked, Tokens } from "marked";

// modified https://github.com/markedjs/marked/issues/655#issuecomment-712380889
const renderer = {
  link({ href, text }: Tokens.Link): string {
    return `<a target="_blank" rel="noreferrer noopener" href="${href}">
        ${text}
      </a>`;
  },
};

marked.use({ renderer });

export default marked;
