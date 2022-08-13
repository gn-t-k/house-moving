export const hasAtLeastOne = <T>(elements: T[]): elements is [T, ...T[]] =>
  elements.length >= 1;
