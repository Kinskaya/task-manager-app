export const getTodayString = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const formatDeadlineForInput = (deadline?: string): string => {
  if (!deadline) return '';
  return deadline.slice(0, 10);
};