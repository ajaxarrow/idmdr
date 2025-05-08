export const useDateHelper = () => {
  const compareDateStrings = (dateA: string, dateB: string): number => {
    const timeA = new Date(dateA).getTime();
    const timeB = new Date(dateB).getTime();
    return timeB - timeA;
  }
  
  return {compareDateStrings}
}