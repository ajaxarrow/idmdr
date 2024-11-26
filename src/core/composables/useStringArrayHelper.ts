export const useStringArrayHelper = () => {
  const arrayToString = (arr: string[]): string =>
    arr.length > 0 ? arr.join(', ') : '';

  const stringToArray = (str: string): string[] =>
      str.length > 0 ? str.split(', ') : [];

  return {
    arrayToString,
    stringToArray
  }
}