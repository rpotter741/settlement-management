import { Backlink } from '@/features/SyncWorkspace/SyncWorkspace.tsx';
import { invoke } from '@tauri-apps/api/core';

export async function updateBacklink(
  backlinkId: string,
  updates: Partial<Backlink>
) {
  try {
    const result: Backlink = await invoke('update_backlink', {
      input: {
        id: backlinkId,
        ...updates,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}

const backlinkCommands = {
  updateBacklink,
};

export default backlinkCommands;
