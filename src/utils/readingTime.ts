export function getReadingTime(content: string): number {
  const charsPerMinute = 400; // 中文阅读速度约 400 字/分钟

  // 移除所有空白字符（空格、换行、制表符等）
  const cleanContent = content.replace(/[\s\n\r\t]/g, '');

  // 统计所有实际字符（包括中文、英文、数字、符号等）
  const charCount = cleanContent.length;

  return Math.ceil(charCount / charsPerMinute);
}
