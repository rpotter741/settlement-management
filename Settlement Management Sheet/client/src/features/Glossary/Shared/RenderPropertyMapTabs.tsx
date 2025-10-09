import { selectEditGlossaryById } from '@/app/selectors/glossarySelectors.js';
import GlossaryAutocomplete from '@/components/shared/DynamicForm/GlossaryAutocomplete.js';
import GlossaryPropEditor from '@/components/shared/Layout/GlossaryPropEditor.js';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/glossary/useNodeEditor.js';
import { useSelector } from 'react-redux';
import getPropertyLabel, { SubModelTypes } from '../utils/getPropertyLabel.js';
import { useEffect, useMemo, useRef } from 'react';
import glossaryServices from '@/services/glossaryServices.js';
import { useAutosave } from '@/hooks/utility/useAutosave/useAutosave.js';
import glossarySectionAutosaveConfig from '@/hooks/utility/useAutosave/configs/glossarySectionConfig.js';
import { SubModelType } from '../../../../../shared/types/index.js';

const RenderPropertyMapTabs = ({
  subModel,
  propertyMap,
}: {
  subModel: SubModelType;
  propertyMap: Record<string, any>[];
}) => {
  //
  const fetchingSection = useRef(false);
  const { glossaryId, id, tab } = useShellContext();
  const { entry, getSubModel } = useNodeEditor(glossaryId, id);
  const glossary = useSelector(selectEditGlossaryById(glossaryId));

  useEffect(() => {
    if (!entry[subModel as keyof typeof entry] && !fetchingSection.current) {
      fetchingSection.current = true;
      getSubModel(subModel as keyof typeof entry);
    }
  }, [entry, subModel]);

  // fetch submodel + append to glossaries.edit.byId + glossaries.static.byId
  // if null, create ephemeral version of it -- which means controller needs to be updated to create new, not just update existing
  // once there's an initial save to the db, replace local version maybe?! i gotta shit

  useAutosave(
    glossarySectionAutosaveConfig({
      glossaryId,
      subModel,
      entryId: id,
      tabId: tab.tabId,
      name: `${tab.name} - ${subModel}`,
    })
  );

  const displayMap = useMemo(() => {
    return [...propertyMap];
  }, [propertyMap]);

  return (
    <>
      {displayMap.map((property: any) => {
        const { label } = getPropertyLabel({
          glossary,
          subModel,
          key: property.keypath,
        });
        if (property.multiple) {
          return (
            <GlossaryPropEditor
              key={property.keypath}
              subModel={subModel}
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
              subModel={subModel}
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
