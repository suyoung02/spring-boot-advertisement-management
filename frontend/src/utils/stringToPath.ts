export const stringToPath = <T extends string>(
  stringPath: T,
  path: string[] = [],
): string[] => {
  const match = stringPath.match(/^([^.]+)\.(.*)/);
  if (!match) return [...path, stringPath];

  const [, key, rest] = match;
  return stringToPath(rest, [...path, key]);
};

export const createFile = async (url: string) => {
  if (typeof window === 'undefined') return; // make sure we are in the browser
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], url);
};
