import { lazy } from 'react';

const glossaryTermsMap: Record<string, any> = {
  glossary: lazy(
    () =>
      import('@/features/Glossary/utils/propertyMaps/GlossaryPropertyLabels.js')
  ),
  continent: lazy(
    () =>
      import(
        '@/features/Glossary/utils/propertyMaps/ContinentPropertyLabels.js'
      )
  ),
};

export default glossaryTermsMap;
