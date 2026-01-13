import { useEffect } from 'react';
import { TabType } from '@/app/types/ToolTypes.js';
import { Tab } from '@/app/types/TabTypes.js';

type HotkeyAction = () => void;
type HotkeyMap = Record<string, HotkeyAction>;

function parseKeyEvent(e: KeyboardEvent): string {
  const keys = [];

  if (e.ctrlKey || e.metaKey) keys.push('mod');
  if (e.shiftKey) keys.push('shift');
  if (e.altKey) keys.push('alt');

  keys.push(e.key.toLowerCase());
  return keys.join('+');
}

export default function useToolHotkeys(
  activeTab: Tab | null,
  hotkeys: HotkeyMap
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyCombo = parseKeyEvent(e);

      const action = hotkeys?.[keyCombo];

      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, hotkeys]);
}
