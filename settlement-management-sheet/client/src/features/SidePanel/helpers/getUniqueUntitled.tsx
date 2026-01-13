import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { selectAllTabNames } from 'features/SidePanel/tabSelectors.js';

const getUniqueUntitledName = () => {
  const tabNames = useSelector(selectAllTabNames);
  const countRef = useRef(0);

  useEffect(() => {
    if (!tabNames) return;

    const baseName = 'Untitled';
    let count = 1;

    // Check for existing Untitled tabs
    while (tabNames.includes(`${baseName} (${count})`)) {
      count++;
    }

    countRef.current = count;
  }, [tabNames]);

  return `Untitled (${countRef.current})`;
};

export default getUniqueUntitledName;
