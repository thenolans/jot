// TODO FIGURE OUT TYPESCRIPT HERE

const tagMarkdownOffests = {
  LI: 3,
  UL: 1,
  OL: 1,
  HR: 5,
  P: 1,
  H1: 3,
};

function getElementAncestors(element, ancestors) {
  if (ancestors === undefined) ancestors = [];
  if (!element) return ancestors;

  const parentIsNoteContainer =
    element?.parentNode?.classList?.contains("c-note");

  // Some <li> elements have other nested tags that we
  // do not want to account for
  if (element?.parentElement?.tagName !== "LI") {
    ancestors.push(element);
  }

  // If the parent is the note container or it is a list item,
  // we want to get all previous siblings if they exist
  if (
    (parentIsNoteContainer && element.previousSibling) ||
    element?.tagName === "LI"
  ) {
    const getUpwardSibling = (element) => {
      if (element.previousSibling) {
        ancestors.push(element.previousSibling);

        // If one of the sibling elements is an <ol> or a <ul>,
        // we need to get all of the children
        if (
          element.previousSibling?.tagName === "UL" ||
          element.previousSibling?.tagName === "OL"
        ) {
          for (let i = 0; i < element.previousSibling.children.length; i++) {
            ancestors.push(element.previousSibling.children[i]);
          }
        }

        // Recursively grab the next sibling
        return getUpwardSibling(element.previousSibling);
      }

      return ancestors;
    };

    getUpwardSibling(element);
  }

  // If we're not at the note container, yet, recursively grab the next parent
  // and start over
  if (!parentIsNoteContainer) {
    return getElementAncestors(element?.parentNode, ancestors);
  }

  return ancestors.filter((el) => Boolean(el?.tagName));
}

export default function getMarkdownSelection(element) {
  if (!element) return undefined;

  const elementsToOffset = getElementAncestors(element);
  const clickOffset = window?.getSelection()?.focusOffset;

  if (!elementsToOffset || !clickOffset) return undefined;

  return elementsToOffset.reduce((offsetCount, element, index) => {
    let amountToIncrement = 0;
    // The first element in the array will be the element that was clicked.
    // It may not be the full text, so use the offset
    if (index === 0) {
      amountToIncrement += clickOffset;
    } else if (
      element.textContent &&
      !(element?.tagName === "OL" || element?.tagName === "UL")
    ) {
      // element.textContent grab all children, so we want to ignore
      // <ul> and <ol> elements so the <li>'s are not counted twice
      amountToIncrement += element.textContent.length;
    }

    // Always offset the amount of the tag for markdown
    if (tagMarkdownOffests[element?.tagName]) {
      amountToIncrement += tagMarkdownOffests[element?.tagName];
    }

    return offsetCount + amountToIncrement;
  }, 0);
}
