export function formatDowntime(startedAt: string, resolvedAt: string | null): string {
  const start = new Date(startedAt);
  const end = resolvedAt ? new Date(resolvedAt) : new Date();
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return '0мин';
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}ч ${String(mins).padStart(2, '0')}мин`;
  }
  return `${mins}мин`;
}
