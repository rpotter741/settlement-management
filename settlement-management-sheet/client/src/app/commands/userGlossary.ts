import { invoke } from '@tauri-apps/api/core';
import { GlossaryStateEntry } from '../types/GlossaryTypes.ts';

export async function createGlossary({
  id,
  name,
  genre,
  sub_genre,
  description,
  created_by,
  content_type,
}: {
  id: string;
  name: string;
  genre: string;
  sub_genre: string;
  description: string;
  created_by: string;
  content_type: string;
}): Promise<GlossaryStateEntry> {
  try {
    const glossary = await invoke('create_glossary', {
      input: {
        id,
        name,
        genre,
        sub_genre,
        description,
        created_by,
        content_type,
      },
    });
    return glossary as GlossaryStateEntry;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateGlossary({
  id,
  updates,
}: {
  id: string;
  updates: Partial<GlossaryStateEntry>;
}) {
  try {
    const glossary = await invoke('update_glossary', {
      id,
      ...updates,
    });
    return glossary as GlossaryStateEntry;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteGlossary({ id }: { id: string }) {
  try {
    await invoke('delete_glossary', { id });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getGlossaries({ userId }: { userId: string }) {
  try {
    const glossaries = await invoke('get_glossaries', { user_id: userId });
    return glossaries as GlossaryStateEntry[];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getGlossaryById({ id }: { id: string }) {
  try {
    const glossary = await invoke('get_glossary_by_id', { id });
    return glossary as GlossaryStateEntry;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const glossaryCommands = {
  createGlossary,
  updateGlossary,
  deleteGlossary,
  getGlossaries,
  getGlossaryById,
};

export default glossaryCommands;
