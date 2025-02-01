export function getNormalDate(inputDate: Date | string | null | undefined): string {
  if (!inputDate) {
    console.warn("getNormalDate: Received null or undefined date");
    return "N/A"; // ✅ Return a default value instead of breaking
  }

  const dateObj = inputDate instanceof Date ? inputDate : new Date(inputDate);

  if (isNaN(dateObj.getTime())) {
    console.warn("getNormalDate: Invalid date format", inputDate);
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(dateObj);

  // Add ordinal suffix to the day
  const day = dateObj.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";

  return formattedDate.replace(/\b(\d{1,2})\b/, `$1${suffix}`);
}
