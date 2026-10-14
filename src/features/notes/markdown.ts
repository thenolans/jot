import DOMPurify from 'dompurify'
import { Marked, type MarkedExtension } from 'marked'

// GitHub-flavored, with a single line break kept as one, since notes are typed like plain text
// (a list of codes on separate lines shouldn't run together).
const options: MarkedExtension = { gfm: true, breaks: true }

const marked = new Marked(options)

// A card in the grid is itself a link, so its preview can't hold links, images or checkboxes: links
// and images leave their text, and task boxes go.
const previewMarked = new Marked(options, {
  renderer: {
    link({ tokens }) {
      return this.parser.parseInline(tokens)
    },
    image({ text }) {
      return escapeHtml(text)
    },
    checkbox() {
      return ''
    },
  },
})

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

const purify = DOMPurify(window)

// Links in a note open in a new tab, without giving that page a handle on this one.
purify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

/** A note's markdown as HTML, with anything that could run script removed. */
export function renderMarkdown(content: string) {
  return purify.sanitize(marked.parse(content, { async: false }))
}

/**
 * A note's markdown as HTML for a preview inside a link: no links, images or inputs, and nothing that
 * could run script.
 */
export function renderMarkdownPreview(content: string) {
  return purify.sanitize(previewMarked.parse(content, { async: false }), {
    FORBID_TAGS: ['a', 'img', 'input', 'button', 'iframe'],
  })
}
