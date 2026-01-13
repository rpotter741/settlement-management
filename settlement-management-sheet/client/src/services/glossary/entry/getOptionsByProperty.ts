import api from '../../interceptor.js';
import { GlossaryEntry } from 'types/index.js';
import { InheritanceMap } from '@/utility/hasParentProperty.js';

export default async function getOptionsByProperty({
  property,
  inheritanceMap,
}: {
  property: keyof GlossaryEntry;
  inheritanceMap: InheritanceMap;
}) {
  return api
    .post('/glossary/optionsByProperty', {
      property,
      inheritanceMap,
    })
    .then((res: any) => {
      return res.data;
    });
}
