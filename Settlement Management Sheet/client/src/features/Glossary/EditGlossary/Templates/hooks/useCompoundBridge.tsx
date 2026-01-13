import {
  transformDropDownInputType,
  transformRangeInputType,
  transformTextInputType,
} from '@/app/dispatches/glossary/changeSubTypePropertyDispatch.js';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';
import { useCallback } from 'react';
import updateSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/updateSubTypePropertyThunk.js';
import updateSubTypeSubPropertyThunk from '@/app/thunks/glossary/subtypes/updateSubTypeSubPropertyThunk.js';
import changeSubTypeSubPropertyThunk from '@/app/thunks/glossary/subtypes/changeSubTypeSubPropertyThunk.js';
import changeSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/changeSubTypePropertyThunk.js';

const useCompoundBridge = ({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  property,
  subPropertySide,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  property: any;
  subPropertySide?: 'left' | 'right';
}) => {
  const isCompound = subPropertySide ? true : false;

  const handleTransform = useCallback(
    (value: any, keypath: string) => {
      if (isCompound) {
        const newProperty = {
          ...property,
          [keypath]: value,
        };
        const newPropertyType = newProperty.type;
        let transformed;
        switch (newPropertyType) {
          case 'text':
            transformed = transformTextInputType(newProperty);
            break;
          case 'dropdown':
            transformed = transformDropDownInputType(newProperty);
            break;
          case 'checkbox':
            transformed = newProperty;
            break;
        }
        changeSubTypeSubPropertyThunk({
          subTypeId,
          groupId,
          propertyId,
          side: subPropertySide!,
          subProperty: transformed || newProperty,
        });
      } else {
        const newProperty = { ...property, [keypath]: value };
        let transformed;
        switch (newProperty.type) {
          case 'text':
            transformed = transformTextInputType(newProperty);
            break;
          case 'dropdown':
            transformed = transformDropDownInputType(newProperty);
            break;
          case 'checkbox':
            transformed = newProperty;
            break;
          case 'range':
            transformed = transformRangeInputType(newProperty);
            break;
        }
        changeSubTypePropertyThunk({
          subTypeId,
          groupId,
          propertyId,
          property: transformed || newProperty,
        });
      }
    },
    [glossaryId, type, subTypeId, groupId, propertyId, isCompound, property]
  );

  const handleChange = useCallback(
    (value: any, keypath: string) => {
      if (isCompound) {
        updateSubTypeSubPropertyThunk({
          subTypeId,
          groupId,
          propertyId,
          side: subPropertySide!,
          keypath,
          value,
        });
      } else {
        updateSubTypePropertyThunk({
          subTypeId,
          groupId,
          propertyId,
          value,
          keypath,
        });
      }
    },
    [glossaryId, type, subTypeId, groupId, propertyId, isCompound, property]
  );

  return { handleTransform, handleChange, isCompound };
};

export default useCompoundBridge;
