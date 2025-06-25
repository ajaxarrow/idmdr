export const useDateHelper = () => {
  const compareDateStrings = (dateA: string, dateB: string): number => {
    const timeA = new Date(dateA).getTime();
    const timeB = new Date(dateB).getTime();
    return timeB - timeA;
  }

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit"
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  return {compareDateStrings, formatDateString, formatDate}
}