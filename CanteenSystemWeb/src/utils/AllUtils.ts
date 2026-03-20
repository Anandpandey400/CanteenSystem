export function formatAsLocal12Hr(
  dateString?: string | null
): string {
  if (!dateString) return "-"; // fallback for null / undefined / ""

  const localDate = new Date(dateString.replace("Z", ""));

  if (isNaN(localDate.getTime())) return "-"; // invalid date protection

  return localDate.toLocaleString("en-IN", {
    hour12: true,
  });
}
export function formatDateTimeForExcel(
  dateString?: string | null
): { date: string; time: string } {
  if (!dateString) {
    return { date: "", time: "" };
  }

  const dateObj = new Date(dateString);

  if (isNaN(dateObj.getTime())) {
    return { date: "", time: "" };
  }

  return {
    date: dateObj.toLocaleDateString("en-IN"),
    time: dateObj.toLocaleTimeString("en-IN", {
      hour12: true,
    }),
  };
}

