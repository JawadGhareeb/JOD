export const formatCurrency = (value: number) =>
  `${value.toLocaleString("ar-SA")} ر.س`;

export const toPercent = (value: number, max: number) => {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / max) * 100));
};
