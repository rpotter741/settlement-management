import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  GlossaryEntryType,
  glossaryEntryTypeOptions,
} from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import SubTypeSelectWrapper from '../toggles/SubTypeSelectWrapper.js';
import FieldRow from '../../wrappers/FieldRow.js';
import capitalize from '@/utility/inputs/capitalize.js';
import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import { Compress, Delete, Expand } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';
import SubTypePreviewWrapper from '../previews/SubTypePreviewWrapper.js';
import SubTypeDropdownPreview from '../previews/SubTypeDropdownPreview.js';
import { useShellContext } from '@/context/ShellContext.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import {
  SubTypeCompoundProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { cloneDeep } from 'lodash';
import { useModalActions } from '@/hooks/global/useModal.js';
import { ModalQueueEntry } from '@/app/types/ModalTypes.js';
import { useRelayChannel } from '@/hooks/global/useRelay.js';

const SubTypeDropDown = ({
  property,
  mode,
  propertyId,
  subPropertySide,
  source,
  onChange,
  subPropertyParent,
  hasSmartSync,
}: {
  property: any;
  mode: SubTypeModes;
  propertyId: string;
  subPropertySide?: 'left' | 'right';
  subPropertyParent?: SubTypeCompoundProperty;
  source: any;
  onChange: (value: any, keypath: string) => void;
  hasSmartSync?: boolean;
}) => {
  const { getPropertyLabel } = usePropertyLabel();
  const [expand, setExpand] = useState(false);
  const [hoverString, setHoverString] = useState('');

  // for synchronizing smart sync rules on entry type updates
  const { openRelay } = useRelayChannel({
    id: 'property-smart-sync-rules',
  });

  console.log(property);

  //local state for property editor
  const [value, setValue] = useState({
    id: '',
    name: '',
    value: source?.value || [],
  });
  const handleLocalChange = (newValue: any) => {
    setValue({ ...value, value: newValue });
  };

  const { showModal } = useModalActions();

  const options = useMemo(() => {
    if (property?.shape.options) {
      return (
        [...property.shape.options].sort((a: string, b: string) =>
          a.localeCompare(b)
        ) || []
      );
    }
    return [];
  }, [property?.shape.options]);

  useEffect(() => {
    if (options.length <= 3 && expand) {
      setExpand(false);
    }
  }, [options.length, expand]);

  const { handleChange, handleTransform, isCompound } = useCompoundBridge({
    propertyId,
    property,
    subPropertySide,
    subPropertyParent,
  });

  const selectTypeOptions = isCompound
    ? [{ name: 'Single-Select', value: 'single' }]
    : [
        { name: 'Single-Select', value: 'single' },
        { name: 'Multi-Select', value: 'multi' },
      ];

  useEffect(() => {
    if (property.smartSync && property.smartSync.parameters.types) {
      const sortJoinSyncTypes = property.smartSync.parameters.types
        .slice()
        .sort()
        .join();
      const sortJoinPropertyTypes = property.shape.relationship
        .slice()
        .sort()
        .join();
      if (sortJoinSyncTypes === sortJoinPropertyTypes) return;
      console.log('matching types between prop and smart sync');
      const ruleStateClone = cloneDeep(property.smartSync);
      ruleStateClone.parameters.types = property.shape.relationship;
      openRelay({
        data: ruleStateClone,
        status: 'complete',
      });
    }
  }, [property.shape.relationship]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        maxWidth: 800,
        position: 'relative',
      }}
    >
      {!isCompound && property.shape.relationship && (
        <Button
          sx={{
            width: '100%',
            gridColumn: 'span 3',
            position: 'absolute',
            top: -42,
          }}
          variant="outlined"
          onClick={() => {
            const entry: ModalQueueEntry = {
              id: 'edit-property-sync-rules',
              componentKey: 'EditSmartSyncRule',
              props: {
                property,
                rule: property.smartSync || {},
                isCompound: false,
              },
            };
            showModal({ entry });
          }}
          color={property.smartSync ? 'info' : 'success'}
        >
          {property.smartSync ? 'Edit' : 'Create'} Property Sync Rules
        </Button>
      )}
      <FieldDefinition
        mode={mode}
        property={property}
        handleChange={handleChange}
        sx={{ gridColumn: 'span 3' }}
        propertyId={propertyId}
        isCompound={isCompound}
        side={subPropertySide}
        subPropertyParent={subPropertyParent}
      />
      <Box
        sx={{
          display:
            property.shape.selectType === 'multi' || mode === 'property'
              ? 'grid'
              : 'flex',
          gridTemplateColumns: 'repeat(3, 1fr)',
          alignItems: 'start',
          gap: 2,
          width: '100%',
          flex: 1,
          gridColumn: 'span 3',
        }}
      >
        <FieldRow
          label="Select Type"
          mode={mode}
          sx={{
            gridColumn: mode === 'property' ? 'span 3' : 'span 1',
            width: property.shape.selectType === 'multi' ? '100%' : 'auto',
            mt: mode === 'property' ? 1 : 0,
          }}
        >
          <SubTypeSelectWrapper
            property={property}
            mode={mode}
            onChange={(e) =>
              handleTransform(e.target.value as string, 'shape.selectType')
            }
            options={selectTypeOptions}
            label="Select Type"
            keypath="shape.selectType"
          />
        </FieldRow>
        {property.shape.selectType === 'multi' && (
          <FieldRow
            label="Max Selections"
            mode={mode}
            sx={{ gridColumn: mode === 'property' ? 'span 3' : 'span 1' }}
          >
            <TextField
              value={property?.shape.maxSelections || ''}
              variant="outlined"
              label={mode === 'property' ? '' : 'Max Selections'}
              placeholder="Infinite"
              fullWidth
              onChange={(e) =>
                handleChange(e.target.value, 'shape.maxSelections')
              }
              type="number"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </FieldRow>
        )}
        <FieldRow
          label="Option Type"
          mode={mode}
          sx={{
            gridColumn: mode === 'property' ? 'span 3' : 'span 1',
            width: property.shape.selectType === 'multi' ? '100%' : 'auto',
          }}
        >
          <SubTypeSelectWrapper
            property={property}
            mode={mode}
            onChange={(e) =>
              handleTransform(e.target.value as string, 'shape.optionType')
            }
            options={[
              { name: 'Entry Type', value: 'entryType' },
              { name: 'List', value: 'list' },
            ].filter((option) => {
              if (
                isCompound &&
                option.value === 'entryType' &&
                subPropertySide === 'right'
              )
                return false;
              return true;
            })}
            label="Option Type"
            keypath="shape.optionType"
          />
        </FieldRow>
      </Box>
      {property?.shape.optionType === 'entryType' && (
        <FieldRow
          label="Entry Type"
          mode={mode}
          sx={{ gridColumn: 'span 3', mt: mode === 'property' ? 1 : 0 }}
        >
          <SubTypeSelectWrapper
            property={property}
            mode={mode}
            onChange={(e) => {
              handleChange(e.target.value, 'shape.relationship');
            }}
            options={glossaryEntryTypeOptions.map((type) => ({
              name: capitalize(getPropertyLabel(type as string).label || type),
              value: type,
            }))}
            label="Entry Type"
            keypath="shape.relationship"
            multiple={true}
          />
        </FieldRow>
      )}
      {property?.shape.optionType === 'list' && (
        <FieldRow
          label="Options"
          mode={mode}
          sx={{ gridColumn: 'span 3', mt: mode === 'property' ? 1 : 0 }}
        >
          <TextField
            variant="outlined"
            label={mode === 'property' ? '' : 'Options'}
            placeholder="Enter an Option and Press Enter"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value.length === 0) return;
                const currentOptions = property?.shape.options || [];
                if (currentOptions.includes(value)) return;
                handleChange([...currentOptions, value], 'shape.options');
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </FieldRow>
      )}
      {property?.shape.optionType === 'list' && (
        <FieldRow
          label="Defined Options"
          mode={mode}
          alignItems="center"
          sx={{ gridColumn: 'span 3', mt: mode === 'property' ? 1 : 0 }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                maxHeight: expand ? '360px' : '120px',
                overflowY: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                minHeight: 46,
                width: '100%',
              }}
            >
              {options && options.length > 3 && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }}
                  size="small"
                  onClick={() => setExpand(!expand)}
                >
                  {expand ? <Compress /> : <Expand />}
                </IconButton>
              )}
              {(options || []).map((option: string, index: number) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: 'start',
                  }}
                >
                  <MenuItem
                    sx={{
                      position: 'relative',
                      width: 'calc(100% - 40px)',
                      '&:hover': {
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      },
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={() => setHoverString(option)}
                    onMouseLeave={() => setHoverString('')}
                    title={hoverString === option ? option : ''}
                  >
                    {hoverString === option && (
                      <IconButton
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                        onClick={() => {
                          const currentOptions =
                            cloneDeep(property?.shape.options) || [];
                          if (property?.defaultList?.includes(option)) {
                            handleChange(
                              property.defaultList.filter(
                                (o: string) => o !== option
                              ),
                              'shape.defaultList'
                            );
                          }
                          handleChange(
                            currentOptions.filter((o: string) => o !== option),
                            'shape.options'
                          );
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                    <Typography sx={{ pl: 4 }}>{option}</Typography>
                    {isCompound && (
                      <Checkbox
                        checked={property?.shape.defaultList?.includes(option)}
                        onChange={() => {
                          const currentDefaults =
                            property?.shape.defaultList || [];
                          if (currentDefaults.includes(option)) {
                            handleChange(
                              currentDefaults.filter(
                                (o: string) => o !== option
                              ),
                              'shape.defaultList'
                            );
                          } else {
                            handleChange(
                              [...currentDefaults, option],
                              'shape.defaultList'
                            );
                          }
                        }}
                      />
                    )}
                  </MenuItem>
                </Box>
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                width: '100%',
                textAlign: 'left',
                position: 'absolute',
                left: 18,
                bottom: -22,
              }}
            >
              {property.shape.options.length !== 1
                ? `${property.shape.options?.length} options defined`
                : '1 option defined'}
            </Typography>
          </Box>
        </FieldRow>
      )}
      {isCompound && property.shape.relationship && (
        <Button
          sx={{
            width: '100%',
            gridColumn: 'span 3',
          }}
          variant="outlined"
          onClick={() => {
            const entry: ModalQueueEntry = {
              id: 'edit-property-sync-rules',
              componentKey: 'EditSmartSyncRule',
              props: {
                property,
                rule: subPropertyParent?.smartSync || {},
                isCompound: true,
              },
            };
            showModal({ entry });
          }}
          color={hasSmartSync ? 'info' : 'success'}
        >
          {hasSmartSync ? 'Edit' : 'Create'} Property Sync Rules
        </Button>
      )}
      <Box sx={{ width: '100%', gridColumn: 'span 3' }}>
        {mode === 'property' && (
          <SubTypePreviewWrapper>
            <SubTypeDropdownPreview
              property={property}
              isPreview={true}
              onChange={handleLocalChange}
              source={value}
              keypath={''}
              liveEdit={false}
              glossaryId={source?.glossaryId as string}
            />
          </SubTypePreviewWrapper>
        )}
      </Box>
    </Box>
  );
};

export default SubTypeDropDown;
