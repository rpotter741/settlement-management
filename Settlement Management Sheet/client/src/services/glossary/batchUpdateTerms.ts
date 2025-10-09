import { SubModelTypes } from '@/features/Glossary/utils/getPropertyLabel.js';
import api from '../interceptor.js';

export default async function updateGlossaryTerm({
  id,
  updates,
}: {
  id: string;
  updates: Array<{
    subModel: SubModelTypes;
    termKey: string;
    visibilityKey: string | null;
    value: any;
  }>;
}) {
  console.log('Batch updating glossary terms:', { id, updates });
  return api
    .post('/glossary/batchUpdateTerms', { id, updates })
    .then((res: any) => {
      return res.data;
    });
}
