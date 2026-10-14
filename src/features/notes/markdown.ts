import DOMPurify from 'dompurify'
import { Marked } from 'marked'

// GitHub-flavored, with a single line break kept as one, since notes are typed like plain text
// (a list of codes on separate lines shouldn't run together).
const marked = new Marked({ gfm: true, breaks: true })

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
