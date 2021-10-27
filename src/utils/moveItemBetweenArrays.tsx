export default function moveItemBetweenArrays<T>(
  sourceArray: T[],
  destinationArray: T[],
  originalIndex: number,
  endIndex: number
): [T[], T[]] {
  const newSourceArray = Array.from(sourceArray);
  const newDestinationArray = Array.from(destinationArray);
  const itemToMove = sourceArray[originalIndex];

  // Remove item from source array
  newSourceArray.splice(originalIndex, 1);

  // Add item to destination array
  newDestinationArray.splice(endIndex, 0, itemToMove);

  return [newSourceArray, newDestinationArray];
}
