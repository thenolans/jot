const UL_START = "- ";
const OL_START = "1. ";

export default function getListItemStart(line: string) {
  if (line.substring(0, 2) === UL_START) return UL_START;
  if (line.substring(0, 3) === OL_START) return OL_START;
  return undefined;
}
