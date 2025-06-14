import { useEffect } from 'react';
import { TabType } from '@/app/types/ToolTypes.js';
import { Tab } from '@/app/types/SidePanelTypes.js';

type HotkeyAction = () => void;
type HotkeyMap = Record<string, HotkeyAction>;
type ToolHotkeyMap = Record<Partial<TabType>, HotkeyMap>;

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
  toolHotkeys: ToolHotkeyMap
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyCombo = parseKeyEvent(e);
      const currentTool = activeTab?.tabType;

      if (!currentTool || !activeTab) return;

      const hotkeysForTool = toolHotkeys[currentTool];
      const action = hotkeysForTool?.[keyCombo];

      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, toolHotkeys]);
}
