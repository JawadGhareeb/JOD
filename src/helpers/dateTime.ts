export function formatRelativeDateAr(isoDate: string): string {
  const now = Date.now();
  const created = new Date(isoDate).getTime();
  const diffMinutes = Math.max(1, Math.floor((now - created) / 60000));

  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;

  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} يوم`;

  const months = Math.floor(days / 30);
  return `منذ ${months} شهر`;
}
