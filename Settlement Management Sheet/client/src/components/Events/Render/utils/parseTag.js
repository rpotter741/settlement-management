function parseTag(tag, context) {
  const isStart = context.startsWith(tag);
  const building = context.narrativeDetails?.[tag] || 'the building';
  return isStart
    ? building.charAt(0).toUpperCase() + building.slice(1)
    : building;
}
