function truncateWithEllipsis(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '…' : truncated + '…';
}
export default truncateWithEllipsis;
