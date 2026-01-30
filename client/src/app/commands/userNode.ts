import { invoke } from '@tauri-apps/api/core';

export async function create_node_and_entry({
  id,
  name,
  entryType,
  fileType,
  subTypeId,
  glossaryId,
  sortIndex,
  icon,
  integrationState,
  parentId,
  createdBy,
  contentType,
}: {
  id: string;
  name: string;
  entryType: string;
  fileType: string;
  subTypeId: string;
  glossaryId: string;
  sortIndex: number;
  icon: string;
  integrationState: string;
  parentId: string;
  createdBy: string;
  contentType: string;
}) {
  try {
    const result = invoke('create_node_and_entry', {
      input: {
        id,
        name,
        entryType,
        fileType,
        subTypeId,
        glossaryId,
        sortIndex,
        icon,
        integrationState,
        parentId,
        createdBy,
        contentType,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteNodeAndEntry({ ids }: { ids: string[] }) {
  try {
    const result = await invoke('delete_node_and_entry', { ids });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getNodes({ glossaryId }: { glossaryId: string }) {
  try {
    const result = await invoke('get_nodes', { glossaryId });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function renameNodeAndEntry({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  try {
    const result = await invoke('rename_node_and_entry', { id, name });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function updateParentId({
  ids,
  parentId,
}: {
  ids: string[];
  parentId: string;
}) {
  try {
    const result = await invoke('update_node_parent_id', {
      ids,
      parent_id: parentId, //snake case for rust
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function updateNodeSortIndices({
  updates,
}: {
  updates: { id: string; sortIndex: number }[];
}) {
  try {
    const result = await invoke('update_node_sort_indices', { updates });
    return result;
  } catch (error) {
    console.error(error);
  }
}

const nodeCommands = {
  create_node_and_entry,
  deleteNodeAndEntry,
  getNodes,
  renameNodeAndEntry,
  updateParentId,
  updateNodeSortIndices,
};

export default nodeCommands;
