// app/utils/ui.ts

/**
 * Trả về chuỗi class CSS cho badge dựa trên điểm số (score).
 * @param score - Điểm số của lead.
 */
export const getScoreBadgeClass = (score: number | string): string => {
  const numericScore = Number(score);

  if (numericScore >= 90) {
    return 'bg-mint/80 border-mint text-ink font-bold';
  }
  if (numericScore > 80) {
    return 'bg-banana/80 border-banana text-ink font-semibold';
  }
  return 'bg-white';
};
