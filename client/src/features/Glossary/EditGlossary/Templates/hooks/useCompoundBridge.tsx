import {
  transformDropDownInputType,
  transformRangeInputType,
  transformTextInputType,
} from '@/app/dispatches/glossary/SubTypePropertyTransformations.js';
import { useCallback } from 'react';
import updateSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/properties/updateSubTypePropertyThunk.js';
import { cloneDeep, get, set } from 'lodash';
import { dispatch } from '@/app/constants.js';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';

const useCompoundBridge = ({
  propertyId,
  property,
  subPropertySide,
  subPropertyParent,
}: {
  propertyId: string;
  property: any;
  subPropertySide?: 'left' | 'right';
  subPropertyParent?: SubTypeProperty;
}) => {
  const isCompound = subPropertySide ? true : false;

  const handleTransform = useCallback(
    (value: any, keypath: string) => {
      if (isCompound && subPropertySide && subPropertyParent) {
        let newProperty = cloneDeep(property);
        set(newProperty, keypath, value);
        const newPropertyType = newProperty.inputType;
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
        const updates: Partial<SubTypeProperty> = {};
        updates.shape = {
          ...subPropertyParent.shape,
          [subPropertySide]: newProperty,
        };
        updateSubTypePropertyThunk({
          propertyId: subPropertyParent.id,
          //@ts-ignore
          property: {
            ...subPropertyParent,
            shape: {
              ...subPropertyParent.shape,
              [subPropertySide]: transformed || newProperty,
            },
          },
          updates,
        });
      } else {
        let newProperty = cloneDeep(property);
        set(newProperty, keypath, value);
        let transformed;
        switch (newProperty.inputType) {
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
        const updates: Partial<SubTypeProperty> = {};
        updates.inputType = newProperty.inputType;
        updates.shape = newProperty.shape;

        updateSubTypePropertyThunk({
          propertyId,
          property: transformed || newProperty,
          updates,
        });
      }
    },
    [propertyId, isCompound, property]
  );

  const handleChange = useCallback(
    (value: any, keypath: string) => {
      if (isCompound && subPropertySide && subPropertyParent) {
        const updatedProperty = cloneDeep(subPropertyParent) as SubTypeProperty;
        const improvedKeypath = `shape.${subPropertySide}.${keypath}`;
        set(updatedProperty, improvedKeypath, value);

        const updates = { shape: updatedProperty.shape };
        updateSubTypePropertyThunk({
          propertyId: subPropertyParent.id,
          property: updatedProperty,
          updates,
        });
      } else {
        const updatedProperty = cloneDeep(property);
        set(updatedProperty, keypath, value);
        let updates = {};
        if (keypath.includes('shape')) {
          updates = {
            shape: updatedProperty.shape,
          };
        } else {
          updates = {
            [keypath]: value,
          };
        }
        updateSubTypePropertyThunk({
          propertyId,
          property: updatedProperty,
          updates,
        });
      }
    },
    [propertyId, isCompound, property]
  );

  return { handleTransform, handleChange, isCompound };
};

export default useCompoundBridge;
