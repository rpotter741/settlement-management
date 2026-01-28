import { v4 as newId } from 'uuid';
import createNodeAndEntry from '@/services/glossary/nodes/createNodeAndEntry.js';
import { genericSubTypeIds } from '@/features/Glossary/EditGlossary/components/GlossaryPropertyLabels.js';
import { invoke } from '@tauri-apps/api/core';
import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.ts';

// export default async function seedWorld({
//   glossaryId,
// }: {
//   glossaryId: string;
// }) {
//   console.log('Seeding the world with initial data...');
//   const continentId = newId();
//   const subTypeId = genericSubTypeIds['continent'];
//   const continentEntryData = {
//     id: continentId,
//     name: 'Continent',
//     fileType: 'section',
//     parentId: null,
//     glossaryId,
//     subTypeId,
//     entryType: 'continent',
//   };
//   await createNodeAndEntry({ entryData: continentEntryData });
//   for (let r = 0; r < 20; r++) {
//     const regionId = newId();
//     const subTypeId = genericSubTypeIds['territory'];
//     const regionEntryData = {
//       id: regionId,
//       name: `Region ${r}`,
//       fileType: 'section',
//       parentId: continentId,
//       glossaryId,
//       subTypeId,
//       entryType: 'territory',
//     };
//     await createNodeAndEntry({ entryData: regionEntryData });

//     for (let t = 0; t < 10; t++) {
//       const territoryId = newId();
//       const subTypeId = genericSubTypeIds['landmark'];
//       const territoryEntryData = {
//         id: territoryId,
//         name: `Landmark ${r}-${t}`,
//         fileType: 'section',
//         parentId: regionId,
//         glossaryId,
//         subTypeId,
//         entryType: 'landmark',
//       };
//       await createNodeAndEntry({ entryData: territoryEntryData });

//       for (let s = 0; s < 5; s++) {
//         const settlementId = newId();
//         const subTypeId = genericSubTypeIds['settlement'];
//         const settlementEntryData = {
//           id: settlementId,
//           name: `Settlement ${r}-${t}-${s}`,
//           fileType: 'section',
//           parentId: territoryId,
//           glossaryId,
//           subTypeId,
//           entryType: 'settlement',
//         };
//         await createNodeAndEntry({ entryData: settlementEntryData });

//         for (let d = 0; d < 3; d++) {
//           const districtId = newId();
//           const subTypeId = genericSubTypeIds['district'];
//           const districtEntryData = {
//             id: districtId,
//             name: `District ${r}-${t}-${s}-${d}`,
//             fileType: 'section',
//             parentId: settlementId,
//             glossaryId,
//             subTypeId,
//             entryType: 'district',
//           };
//           await createNodeAndEntry({ entryData: districtEntryData });
//         }
//       }
//     }
//   }

//   console.log('Generated 4,220 nodes');
// }

export async function loadGlossaries(userId: string = 'robbiepottsdm') {
  try {
    const glossaries = await invoke('get_glossaries', {
      userId: userId, // Note: camelCase in TS becomes snake_case param in Rust
    });

    console.log('Got glossaries:', glossaries);
    return glossaries;
  } catch (error) {
    console.error('Failed to load glossaries:', error);
  }
}

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
