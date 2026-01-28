import { invoke } from '@tauri-apps/api/core';
import { GlossaryEntry } from '../../../../shared/types/glossaryEntry.ts';

export async function getEntriesById({ ids }: { ids: string[] }) {
  try {
    const result = await invoke('get_entries_by_id', { ids });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getEntryById({ id }: { id: string }) {
  //maybe just do single bulk action? Makes more sense than maintaining two of these things
  try {
    const result = await invoke('get_entry_by_id', { id });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function updateEntryGroups({ entry }: { entry: GlossaryEntry }) {
  try {
    const result = await invoke('update_entry_groups', { entry });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function updateEntrySubType({
  entryId,
  subTypeId,
}: {
  entryId: string;
  subTypeId: string;
}) {
  try {
    const result = await invoke('update_entry_sub_type', {
      entryId,
      subTypeId,
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}

const entryCommands = {
  getEntriesById,
  getEntryById,
  updateEntryGroups,
  updateEntrySubType,
};

export default entryCommands;
