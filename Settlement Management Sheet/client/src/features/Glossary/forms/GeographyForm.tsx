import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';
import Editor from '@/components/shared/TipTap/Editor.jsx';
import { debounce, set } from 'lodash';
import thunks from '@/app/thunks/glossaryThunks.js';
import { useSelector } from 'react-redux';
import { selectActiveId } from '@/app/selectors/glossarySelectors.js';
import useNodeEditor from '@/hooks/useNodeEditor.js';
import { AppDispatch } from '@/app/store.js';
import { updateTab } from '@/app/slice/sidePanelSlice.js';
import useDebouncedEffect from '@/hooks/useDebouncedEffect.js';
import { useDebounce } from '@/hooks/useDebounce.js';
import EditFieldWithButton from '@/components/shared/Layout/EditFieldWithButton.js';
import PageBox from '@/components/shared/Layout/PageBox.js';
import { Tab } from '@/app/types/SidePanelTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import { Create } from '@mui/icons-material';

interface GeographyFormProps {
  tab: Tab;
  setModalContent: (content: {
    component: React.ComponentType;
    props?: Record<string, any>;
  }) => void;
}

const GeographyForm: React.FC<GeographyFormProps> = ({
  tab,
  setModalContent,
}) => {
  const [lastSaved, setLastSaved] = useState<Record<string, any>>({});

  const theme = useTheme();

  useEffect(() => {
    console.log(lastSaved, 'lastSaved in GeographyForm');
  });

  return (
    <CreateGlossaryShell tab={tab} setModalContent={setModalContent}>
      <Editor
        keypath="description"
        lastSaved={lastSaved?.description || null}
        setLastSaved={setLastSaved}
      />
    </CreateGlossaryShell>
  );
};

export default GeographyForm;
