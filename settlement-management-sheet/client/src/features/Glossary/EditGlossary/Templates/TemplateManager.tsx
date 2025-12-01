import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import GlossaryMainWrapper from '../components/GlossaryMainWrapper.js';
import FocusOrchestrator from './components/PropertyOrchestrator.js';
import FormOrchestrator from './components/FormOrchestrator.js';
import { ArrowLeft, ArrowRight, VideoFile } from '@mui/icons-material';
import PreviewOrchestrator from './components/PreviewOrchestrator.js';
import useTemplateManager from './hooks/useTemplateManager.js';
import SubTypeAnchorSelect from './components/inputs/SubTypeAnchorSelect.js';
import SubTypeEntryType from './components/inputs/SubTypeEntryType.js';
import { GenericContext } from '@/context/GenericContext.js';
import updateSubTypeNameThunk from '@/app/thunks/glossary/subtypes/updateSubTypeNameThunk.js';
import { ShellContext } from '@/context/ShellContext.js';
import GroupOrchestrator from './components/GroupOrchestrator.js';
import SubTypeOrchestrator from './components/SubTypeOrchestrator.js';

const SubTypeManager = () => {
  const {
    subTypeId,
    subtype,
    mode,
    activeId,
    // source,
    previousLabel,
    nextLabel,
    activeGroup,
    activeProperty,
    scrolling,
    // setSource,
    // handleChange,
    getHexValue,
    dispatch,
    getPropertyLabel,
    handleAnchorChange,
    updateActiveGroupProperty,
    // onAddData,
    // onRemove,
    group,
    deselectGroup,
  } = useTemplateManager();

  // if (subType && mode === 'preview') {
  //   return (
  // <ShellContext.Provider
  //   value={{
  //     subTypeId,
  //     mode,
  //     source,
  //     setSource,
  //     handleChange,
  //     scrolling,
  //     updateActiveGroupProperty,
  //     getPropertyLabel,
  //     onAddData,
  //     onRemove,
  //   }}
  // >
  //       <PreviewOrchestrator
  //         subType={subType}
  //         mode={mode}
  //         editId={subTypeId!}
  //       />
  //     </ShellContext.Provider>
  //   );
  // }

  return (
    <GlossaryMainWrapper>
      {activeProperty || activeGroup || subTypeId ? (
        <Box
          sx={{
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            overflowY: 'scroll',
            background: `linear-gradient(to right bottom, ${getHexValue({ color: 'background', key: 'paper' })} 50%, ${getHexValue({ color: 'background', key: 'default' })} 100%)`,
          }}
        >
          {mode === 'subtype' && subTypeId && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'start',
                py: 4,
                justifyContent: 'space-between',
                gap: 2,
                width: '100%',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                bgcolor: 'background.paper',
                zIndex: 10,
                maxWidth: 800,
              }}
            >
              {/* <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'start', xl: 'center' },
                gap: 2,
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <TextField
                  label="Sub-Type Name"
                  sx={{ width: '50%' }}
                  value={subType.name}
                  onChange={(e) => {
                    updateSubTypeNameThunk({
                      subTypeId: subTypeId,
                      name: e.target.value,
                    });
                  }}
                />
                <SubTypeEntryType
                  subType={subType}
                  subTypeId={subTypeId}
                  getPropertyLabel={getPropertyLabel}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'start', xl: 'center' },
                }}
              >
                <SubTypeAnchorSelect
                  handleAnchorChange={handleAnchorChange}
                  subType={subType}
                  semanticAnchors={semanticAnchors}
                  type="primary"
                />
                <SubTypeAnchorSelect
                  handleAnchorChange={handleAnchorChange}
                  subType={subType}
                  semanticAnchors={semanticAnchors}
                  type="secondary"
                />
              </Box>
            </Box> */}
            </Box>
          )}

          <Box
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            <ShellContext.Provider
              value={{
                subTypeId,
                mode,
                // source,
                // setSource,
                // handleChange,
                scrolling,
                updateActiveGroupProperty,
                getPropertyLabel,
                // onAddData,
                // onRemove,
              }}
            >
              <GenericContext.Provider
                value={{
                  subTypeId,
                  mode,
                  // source,
                  // setSource,
                  // handleChange,
                  scrolling,
                  updateActiveGroupProperty,
                  getPropertyLabel,
                  // onAddData,
                  // onRemove,
                }}
              >
                {mode === 'property' && activeProperty && (
                  <FocusOrchestrator
                    propertyId={activeProperty || ''}
                    mode={mode}
                  />
                )}
                {mode === 'group' && group && (
                  <GroupOrchestrator
                    group={group}
                    deselectGroup={deselectGroup}
                  />
                )}
                {mode === 'subtype' && subTypeId && (
                  <SubTypeOrchestrator
                    subtype={subtype}
                    deselectSubType={() => {}}
                  />
                )}
              </GenericContext.Provider>
            </ShellContext.Provider>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(to right bottom, ${getHexValue({ color: 'background', key: 'paper' })} 50%, ${getHexValue({ color: 'background', key: 'default' })} 100%)`,
          }}
        >
          {mode === 'property' && 'No Property Selected'}
          {mode === 'group' && 'No Group Selected'}
          {mode === 'subtype' && 'No Sub-Type Selected'}
        </Box>
      )}
    </GlossaryMainWrapper>
  );
};

export default SubTypeManager;
