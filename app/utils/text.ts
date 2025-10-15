// app/utils/text.ts

/**
 * Cắt ngắn một chuỗi văn bản nếu nó dài hơn độ dài cho phép.
 * @param text - Chuỗi văn bản cần cắt.
 * @param maxLength - Độ dài tối đa (mặc định là 20).
 * @param suffix - Chuỗi kết thúc (mặc định là '...').
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 20,
  suffix: string = '...'
): string => {
  if (!text) {
    return '';
  }
  if (text.length > maxLength) {
    return text.substring(0, maxLength - suffix.length) + suffix;
  }
  return text;
};
