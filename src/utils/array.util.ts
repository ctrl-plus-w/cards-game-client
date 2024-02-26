/**
 * Stringify an array by putting "," and a "and" between each element.
 * @param arr The array to stringify
 * @returns A stringified version of the array
 */
export const arrayToString = (arr: string[]): string => {
  if (arr.length === 1) return arr[0];
  return `${arr.slice(0, arr.length - 1).join(', ')} and ${arr[arr.length - 1]}`;
};

export const isDefined = <T>(el: T | undefined | null): el is T => {
  return el !== undefined && el !== null;
};

export const lastEl = <T>(arr: T[]) => {
  if (arr.length) return arr[arr.length - 1];
};
