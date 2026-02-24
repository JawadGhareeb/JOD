const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const toStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const daysUntil = (dateValue: string): number => {
  const today = toStartOfDay(new Date());
  const target = toStartOfDay(new Date(dateValue));
  return Math.ceil((target.getTime() - today.getTime()) / DAY_IN_MS);
};

export const isEndingSoon = (dateValue: string, limit = 7): boolean => {
  const remainingDays = daysUntil(dateValue);
  return remainingDays >= 0 && remainingDays <= limit;
};

export const isWithinRange = (
  dateValue: string,
  range: "week" | "month",
): boolean => {
  const remainingDays = daysUntil(dateValue);
  if (remainingDays < 0) {
    return false;
  }

  if (range === "week") {
    return remainingDays <= 7;
  }

  return remainingDays <= 30;
};
