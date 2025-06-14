const resolveDuplicatesWithPriority = (thresholds, lastTouchedId) => {
  const MIN_VALUE = 1;
  const MAX_VALUE = 100;

  const thresholdsClone = { ...thresholds };
  const changes = [];
  const usedValues = new Set();

  // Turn the object into a list so it's easier to sort and manipulate
  let thresholdList = Object.entries(thresholdsClone).map(([id, data]) => ({
    id,
    name: data.name,
    max: data.max,
  }));

  // Helper: finds a unique value close to desiredVal by moving up/down
  // until it's not in usedValues (or hits clamp boundaries).
  const findUniqueValue = (desiredVal) => {
    let val = desiredVal;

    // We'll loop, but guard with a counter to prevent infinite loops
    let attempts = 0;
    while (usedValues.has(val) && attempts < 200) {
      // Find closest smaller & larger used values
      const smallerUsed = [...usedValues].filter((v) => v < val);
      const largerUsed = [...usedValues].filter((v) => v > val);

      const closestSmaller = smallerUsed.length
        ? Math.max(...smallerUsed)
        : -Infinity;
      const closestLarger = largerUsed.length
        ? Math.min(...largerUsed)
        : Infinity;

      // Compute room down & up
      // (how many steps we can move down or up before colliding with a used value)
      const roomDown =
        closestSmaller === -Infinity
          ? val - MIN_VALUE
          : val - (closestSmaller + 1);
      const roomUp =
        closestLarger === Infinity ? MAX_VALUE - val : closestLarger - 1 - val;

      // Decide direction
      if (roomDown >= roomUp && roomDown > 0 && val > MIN_VALUE) {
        val--;
      } else if (roomUp > 0 && val < MAX_VALUE) {
        val++;
      } else {
        // If we can't move up or down, break to avoid infinite loop
        break;
      }
      // Clamp to [MIN_VALUE, MAX_VALUE]
      val = Math.max(MIN_VALUE, Math.min(MAX_VALUE, val));
      attempts++;
    }
    return val;
  };

  // --- 1) Handle the "priority" threshold first using the same logic ---
  const priorityIndex = thresholdList.findIndex((t) => t.id === lastTouchedId);
  if (priorityIndex >= 0) {
    let priorityItem = thresholdList[priorityIndex];
    let oldVal = priorityItem.max;

    // Clamp first
    let desiredVal = Math.max(MIN_VALUE, Math.min(MAX_VALUE, oldVal));
    // Then move it until unique
    let uniqueVal = findUniqueValue(desiredVal);

    // Record changes if any
    if (uniqueVal !== oldVal) {
      changes.push(
        `Threshold ${priorityItem.name} changed from ${oldVal} to ${uniqueVal} to prevent duplicates.`
      );
    }

    // Update threshold & mark the used value
    priorityItem.max = uniqueVal;
    usedValues.add(uniqueVal);

    // Put it back
    thresholdList[priorityIndex] = priorityItem;
  }

  // --- 2) Sort the remaining thresholds by their max so we process them in ascending order ---
  thresholdList.sort((a, b) => a.max - b.max);

  // --- 3) Handle the rest, skipping the one we already did ---
  for (let i = 0; i < thresholdList.length; i++) {
    const item = thresholdList[i];
    if (item.id === lastTouchedId) {
      // Already handled priority threshold
      continue;
    }

    const oldVal = item.max;

    // Clamp the original first
    let desiredVal = Math.max(MIN_VALUE, Math.min(MAX_VALUE, oldVal));

    // If it's already used, or collides, find a unique value
    if (usedValues.has(desiredVal)) {
      desiredVal = findUniqueValue(desiredVal);
    }

    // If we still haven't used it, do the final check
    if (usedValues.has(desiredVal)) {
      desiredVal = findUniqueValue(desiredVal);
    }

    // Record changes
    if (desiredVal !== oldVal) {
      changes.push(
        `Threshold ${item.name} changed from ${oldVal} to ${desiredVal} to prevent duplicates.`
      );
    }

    // Update & store
    item.max = desiredVal;
    usedValues.add(desiredVal);
    thresholdList[i] = item;
  }

  // --- 4) Rebuild the clone object from the updated list ---
  thresholdList.forEach((t) => {
    thresholdsClone[t.id] = { name: t.name, max: t.max };
  });

  return { thresholdsClone, changes };
};

export default resolveDuplicatesWithPriority;
