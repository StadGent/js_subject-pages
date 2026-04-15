// app/utils/natural-sort.js

/**
 * Natural sort comparator for strings
 * Handles alphanumeric sorting (e.g., "3-00", "K.", "N2:", "N3:")
 */

export function naturalSort (a, b) {
  // Split strings into parts (numbers and non-numbers)
  const splitRegex = /(\d+)/;
  const partsA = a.split(splitRegex);
  const partsB = b.split(splitRegex);

  const maxLength = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLength; i++) {
    const partA = partsA[i] || '';
    const partB = partsB[i] || '';

    // Check if both parts are numeric
    const numA = parseInt(partA, 10);
    const numB = parseInt(partB, 10);

    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) return numA - numB;
    } else {
      if (partA !== partB) return partA.localeCompare(partB);
    }
  }

  return 0;
}
