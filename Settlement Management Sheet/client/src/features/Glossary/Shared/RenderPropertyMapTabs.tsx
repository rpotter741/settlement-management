import { selectEditGlossaryById } from '@/app/selectors/glossarySelectors.js';
import GlossaryAutocomplete from '@/components/shared/DynamicForm/GlossaryAutocomplete.js';
import GlossaryPropEditor from '@/components/shared/Layout/GlossaryPropEditor.js';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/glossary/useNodeEditor.js';
import { useSelector } from 'react-redux';
import getPropertyLabel, {
  SubSectionTypes,
} from '../utils/getPropertyLabel.js';
import { useEffect, useMemo, useRef } from 'react';
import glossaryServices from '@/services/glossaryServices.js';

const RenderPropertyMapTabs = ({
  section,
  propertyMap,
}: {
  section: SubSectionTypes;
  propertyMap: Record<string, any>[];
}) => {
  //
  const fetchingSection = useRef(false);
  const { glossaryId, id } = useShellContext();
  const { entry, getSubModel } = useNodeEditor(glossaryId, id);
  const glossary = useSelector(selectEditGlossaryById(glossaryId));
  console.log(entry);

  useEffect(() => {
    if (!entry[section as keyof typeof entry] && !fetchingSection.current) {
      fetchingSection.current = true;
      getSubModel(section as keyof typeof entry);
    }
  }, [entry, section]);

  // fetch submodel + append to glossaries.edit.byId + glossaries.static.byId
  // if null, create ephemeral version of it -- which means controller needs to be updated to create new, not just update existing
  // once there's an initial save to the db, replace local version maybe?! i gotta shit

  const displayMap = useMemo(() => {
    return [...propertyMap];
  }, [propertyMap]);

  return (
    <>
      {displayMap.map((property: any) => {
        const label = getPropertyLabel({
          glossary,
          section,
          key: property.keypath,
        });
        console.log(label, property.keypath);
        if (property.multiple) {
          return (
            <GlossaryPropEditor
              key={property.keypath}
              multiple={true}
              keypath={property.keypath as keyof typeof entry}
              options={[]}
              label={label}
            />
          );
        } else {
          return (
            <GlossaryAutocomplete
              key={property.keypath}
              multiple={false}
              keypath={property.keypath as keyof typeof entry}
              options={[]}
              label={label}
            />
          );
        }
      })}
    </>
  );
};

export default RenderPropertyMapTabs;
