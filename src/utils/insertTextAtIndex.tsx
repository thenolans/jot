export default function insertTextAtIndex(
  index: number,
  originalContent: string,
  contentToAdd: string
) {
  if (index > 0) {
    return (
      originalContent.substring(0, index) +
      contentToAdd +
      originalContent.substr(index)
    );
  }

  return originalContent + contentToAdd;
}
