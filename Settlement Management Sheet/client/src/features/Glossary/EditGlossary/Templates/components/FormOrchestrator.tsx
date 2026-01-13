import { selectSubTypeById } from '@/app/selectors/subTypeSelectors.js';
import { Box, Divider, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';
import SubTypeTextInput from './inputs/SubTypeText.js';
import useTheming from '@/hooks/layout/useTheming.js';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SubTypeDropDown from './inputs/SubTypeDropDown.js';
import SubTypeCheckbox from './inputs/SubTypeCheckbox.js';
import SubTypeRange from './inputs/SubTypeRange.js';
import SubTypeCompound from './inputs/SubTypeCompound.js';
import updateSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/updateSubTypePropertyThunk.js';

const FormOrchestrator = ({
  glossaryId,
  type,
  subTypeId,
  mode,
  activeProperty,
  activeGroup,
  updateActiveGroupProperty,
  scrolling,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  mode: 'focus' | 'form' | 'preview';
  activeProperty: string | null;
  activeGroup: string | null;
  updateActiveGroupProperty: (propertyId: string, groupId: string) => void;
  scrolling: React.MutableRefObject<boolean>;
}) => {
  const subType = useSelector(selectSubTypeById(subTypeId));

  const { getAlphaColor } = useTheming();

  const [isFormFocused, setIsFormFocused] = useState(false);
  const propertyRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleChange = useCallback(
    (value: any, keypath: string, groupId: string, propertyId: string) => {
      updateSubTypePropertyThunk({
        subTypeId,
        groupId,
        propertyId,
        keypath,
        value,
      });
    },
    [glossaryId, type, subTypeId]
  );

  if (!subType) return null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isFormFocused || scrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const [type, propId, groupId] = entry.target.id.split('_');
            updateActiveGroupProperty(propId, groupId);
          }
        });
      },
      {
        root: null, // viewport
        threshold: 0.1, // element’s midpoint roughly in view
        rootMargin: '-48% 0px -48% 0px',
        // top and bottom margins remove 40% each, leaving a 20% vertical window
        // adjust to taste; this defines your "150px zone" idea
      }
    );

    Object.values(propertyRefs.current).forEach(
      (el) => el && observer.observe(el)
    );

    return () => observer.disconnect();
  }, [subType, activeGroup, isFormFocused, scrolling]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: 800,
        position: 'relative',
      }}
    >
      {subType?.groupOrder?.map((groupId: string) => {
        if (groupId !== activeGroup) return null;
        return (
          <Box
            key={groupId}
            sx={{
              mb: 3,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              py: 2,
              border: 1,
              borderRadius: 4,
              borderColor:
                activeGroup === groupId
                  ? getAlphaColor({
                      color: 'success',
                      key: 'light',
                      opacity: 0.2,
                    })
                  : 'transparent',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              {subType.groupData[groupId].name}
            </Typography>
            <Divider
              sx={{
                mb: 2,
              }}
              flexItem
            />
            {subType.groupData[groupId].propertyOrder.map(
              (propertyId: string) => (
                <Box
                  ref={(el) => {
                    //@ts-ignore
                    propertyRefs.current[propertyId] = el;
                  }}
                  id={`property_${propertyId}_${groupId}`}
                  key={propertyId}
                  sx={{
                    mb: 2,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    maxWidth: 800,
                    p: 2,
                    py: 4,
                    backgroundColor:
                      activeProperty === propertyId
                        ? getAlphaColor({
                            color: 'success',
                            key: 'light',
                            opacity: 0.05,
                          })
                        : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                  onFocus={() => {
                    updateActiveGroupProperty(propertyId, groupId);
                    setIsFormFocused(true);
                  }}
                  onBlur={() => {
                    setIsFormFocused(false);
                  }}
                >
                  {subType.groupData[groupId].propertyData[propertyId].type ===
                    'text' && (
                    <SubTypeTextInput
                      property={
                        subType.groupData[groupId].propertyData[propertyId]
                      }
                      mode={mode}
                      glossaryId={glossaryId}
                      type={type}
                      subTypeId={subTypeId}
                      groupId={groupId}
                      propertyId={propertyId}
                    />
                  )}
                  {subType.groupData[groupId].propertyData[propertyId].type ===
                    'dropdown' && (
                    <SubTypeDropDown
                      property={
                        subType.groupData[groupId].propertyData[propertyId]
                      }
                      mode={mode}
                      glossaryId={glossaryId}
                      type={type}
                      subTypeId={subTypeId}
                      groupId={groupId}
                      propertyId={propertyId}
                    />
                  )}
                  {subType.groupData[groupId].propertyData[propertyId].type ===
                    'checkbox' && (
                    <SubTypeCheckbox
                      property={
                        subType.groupData[groupId].propertyData[propertyId]
                      }
                      mode={mode}
                      glossaryId={glossaryId}
                      type={type}
                      subTypeId={subTypeId}
                      groupId={groupId}
                      propertyId={propertyId}
                    />
                  )}
                  {subType.groupData[groupId].propertyData[propertyId].type ===
                    'range' && (
                    <SubTypeRange
                      property={
                        subType.groupData[groupId].propertyData[propertyId]
                      }
                      mode={mode}
                      glossaryId={glossaryId}
                      type={type}
                      subTypeId={subTypeId}
                      groupId={groupId}
                      propertyId={propertyId}
                    />
                  )}
                  {subType.groupData[groupId].propertyData[propertyId].type ===
                    'compound' && (
                    <SubTypeCompound
                      property={
                        subType.groupData[groupId].propertyData[propertyId]
                      }
                      mode={mode}
                      glossaryId={glossaryId}
                      type={type}
                      subTypeId={subTypeId}
                      groupId={groupId}
                      propertyId={propertyId}
                    />
                  )}
                  <Divider
                    sx={{
                      width: '50%',
                      mt: 2,
                      transform: 'translateX(50%)',
                      borderColor:
                        activeProperty === propertyId
                          ? 'success.main'
                          : 'secondary.main',
                      transition: 'border-color 0.3s ease',
                    }}
                    flexItem
                  />
                </Box>
              )
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default FormOrchestrator;
