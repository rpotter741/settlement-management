import { isEqual } from 'lodash';

export function detectStructuralDrift(base: any, current: any): boolean {
  // 1️⃣ Check for fundamental identity change
  if (base.entryType !== current.entryType) return true;

  // 2️⃣ Group count / order
  if (base.groupOrder.length !== current.groupOrder.length) return true;

  // Optional: if you want order to *matter*, uncomment this:
  // if (!isEqual(base.groupOrder, current.groupOrder)) return true;

  // 3️⃣ Compare each group
  for (const gId of base.groupOrder) {
    const baseGroup = base.groupData[gId];
    const currGroup = current.groupData[gId];

    // group removed or renamed
    if (!currGroup) return true;

    // property count check
    if (baseGroup.propertyOrder.length !== currGroup.propertyOrder.length)
      return true;

    // 4️⃣ Compare properties
    for (const pId of baseGroup.propertyOrder) {
      const baseProp = baseGroup.propertyData[pId];
      const currProp = currGroup.propertyData[pId];
      if (!currProp) return true;

      // property type changed
      if (baseProp.type !== currProp.type) return true;

      // 🔄 Check compound sides if applicable
      if (baseProp.type === 'compound') {
        const sides: ('left' | 'right')[] = ['left', 'right'];
        for (const side of sides) {
          const baseSide = baseProp[side];
          const currSide = currProp[side];
          if (!baseSide || !currSide) continue;
          if (baseSide.type !== currSide.type) return true;
        }
      }

      // 🎯 Compare bounded input differences
      if (
        (baseProp.type === 'dropdown' || baseProp.type === 'range') &&
        !isEqual(baseProp.options, currProp.options)
      )
        return true;
    }
  }

  // No meaningful drift detected
  return false;
}
