import { ContextKeys, Mode } from '@/features/SidePanel/SidePanel.js';
import { createGenericContext } from '../GenericContext.js';
import { ToolName } from '@/app/types/ToolTypes.js';
import { set } from 'lodash';
import contextMap from '@/maps/sidebarContextMap.js';

export const [SidebarContextProvider, useSidebarContext] =
  createGenericContext<{
    mode?: Mode;
    setMode?: (mode: Mode) => void;
    contextKey?: ContextKeys | null;
    setContextKey?: (key: ContextKeys | null) => void;
    tool: ToolName | null;
    setTool: (tool: ToolName | null) => void;
    active?: string;
    setActive?: (active: string) => void;
    activeContext?: keyof typeof contextMap | null;
    setActiveContext?: (active: keyof typeof contextMap | null) => void;
    changeWidth: (width: number) => void;
  }>();
