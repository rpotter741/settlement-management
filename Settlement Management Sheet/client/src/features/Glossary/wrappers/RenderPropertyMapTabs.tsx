import GlossaryAutocomplete from '@/components/shared/DynamicForm/GlossaryAutocomplete.js';
import GlossaryPropEditor from '@/components/shared/Layout/GlossaryPropEditor.js';
import { useShellContext } from '@/context/ShellContext.js';
import useNodeEditor from '@/hooks/useNodeEditor.js';

const RenderPropertyMapTabs = ({
  propertyMap,
}: {
  propertyMap: Record<string, any>[];
}) => {
  //
  const { glossaryId, id } = useShellContext();
  const { entry } = useNodeEditor(glossaryId, id);
  return (
    <>
      {propertyMap.map((section: any) => {
        if (section.multiple) {
          return (
            <GlossaryPropEditor
              key={section.keypath}
              multiple={true}
              keypath={section.keypath as keyof typeof entry}
              options={[]}
              label={section.label}
            />
          );
        } else {
          return (
            <GlossaryAutocomplete
              key={section.keypath}
              multiple={false}
              keypath={section.keypath as keyof typeof entry}
              options={[]}
              label={section.label}
            />
          );
        }
      })}
    </>
  );
};

export default RenderPropertyMapTabs;
