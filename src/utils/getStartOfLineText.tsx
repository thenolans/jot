const pattern = /\r?\n|\r/;

export default function getStartOfLineText(textarea: HTMLTextAreaElement) {
  const lineIndex =
    textarea.value.substr(0, textarea.selectionStart).split(pattern).length - 1;

  let lines = textarea.value.split(pattern);

  return lines[lineIndex];
}
