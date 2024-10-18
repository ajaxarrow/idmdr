export const useObjectChecker = () => {
  const isEmptyObject = (obj: any): boolean => {
    if(obj === null || obj === undefined) {
      return true
    }
    if (typeof obj === 'string') {
      try {
        obj = JSON.parse(obj);
      } catch (e) {
        return false;
      }
    }

    return Object.keys(obj).length === 0;
  };

   return {
     isEmptyObject
   }
}