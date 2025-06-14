import api from './interceptor.js';
import {
  GlossaryEntry,
  GlossaryEntryType,
  GlossaryNode,
} from '../../../types/index.js';

const getGlossaries = async () => {
  const response = await api.get('/glossary');
  return response.data.glossaries;
};

const getGlossaryById = async ({ glossaryId }: { glossaryId: string }) => {
  return api
    .get(`glossary/${glossaryId}`, { params: { glossaryId } })
    .then((res: any) => {
      return res.data;
    });
};

const getGlossaryNodes = async ({ glossaryId }: { glossaryId: string }) => {
  return api
    .get(`/glossary/nodes/${glossaryId}`, { params: { glossaryId } })
    .then((res: any) => {
      return res.data.structure;
    });
};

const getGlossaryEntryById = async ({
  nodeId,
  entryType,
}: {
  nodeId: string;
  entryType: GlossaryEntryType;
}) => {
  return api
    .get(`/glossary/entries/${entryType}/${nodeId}`, {
      params: { id: nodeId, entryType },
    })
    .then((res: any) => {
      return res.data.entry as GlossaryEntry;
    });
};

const createGlossary = async ({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) => {
  return api.post('/glossary', { id, name, description }).then((res: any) => {
    return res.data;
  });
};

const createEntry = async ({
  id,
  name,
  entryType,
  type,
  parentId,
  glossaryId,
  entryData,
}: {
  id: string;
  name: string;
  entryType: GlossaryEntryType | null;
  type: 'file' | 'folder';
  parentId: string | null;
  glossaryId: string;
  entryData: any;
}) => {
  return api
    .post('/glossary/entry', {
      id,
      name,
      entryType,
      type,
      parentId,
      glossaryId,
      entryData,
    })
    .then((res: any) => {
      return res.data;
    });
};

const deleteEntry = async ({
  id,
  entryType,
  glossaryId,
}: {
  id: string;
  entryType: GlossaryEntryType;
  glossaryId: string;
}) => {
  return api
    .post('/glossary/entry/delete', { id, entryType, glossaryId })
    .then((res: any) => {
      return res.data;
    });
};

const updateEntry = async ({
  id,
  entryType,
  entryData,
}: {
  id: string;
  entryType: GlossaryEntryType | null;
  entryData: any;
}) => {
  return api
    .post('/glossary/entry/update', { id, entryType, entryData })
    .then((res: any) => {
      return res.data;
    });
};

const updateNodeSortIndexes = async <T>({ updates }: { updates: Array<T> }) => {
  return api.post('/glossary/entry/sort', { updates }).then((res: any) => {
    return res.data;
  });
};

const updateNodeParentId = async ({
  id,
  parentId,
}: {
  id: string;
  parentId: string;
}) => {
  return api
    .post('/glossary/entry/parent', { id, parentId })
    .then((res: any) => {
      return res.data;
    });
};

const updateGlossary = async ({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) => {
  return api
    .post('/glossary/update', { id, name, description })
    .then((res: any) => {
      return res.data;
    });
};

const deleteGlossary = async ({ id }: { id: string }) => {
  return api.post('/glossary/delete', { id }).then((res: any) => {
    return res.data;
  });
};

const actions = {
  getGlossaries,
  getGlossaryById,
  getGlossaryNodes,
  getGlossaryEntryById,
  createGlossary,
  deleteEntry,
  createEntry,
  updateEntry,
  updateNodeSortIndexes,
  updateNodeParentId,
  updateGlossary,
  deleteGlossary,
};

export default actions;
