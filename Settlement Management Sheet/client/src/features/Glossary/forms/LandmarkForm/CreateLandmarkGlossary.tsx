import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Tab } from '@/app/types/SidePanelTypes.js';
import CreateGlossaryShell from '@/components/shared/CreateShell/CreateGlossaryShell.js';
import { selectEntryById } from '@/app/selectors/glossarySelectors.js';
import { useSelector } from 'react-redux';
import EditLandmarkForm from './EditLandmarkForm.js';
import EditGlossaryEntryForm from '../EditGlossaryWithShell.js';
import PreviewGlossaryWithShell from '../PreviewGlossaryWithShell.js';

interface LandmarkFormProps {
  tab: Tab;
}

const LandmarkForm: React.FC<LandmarkFormProps> = ({ tab }) => {
  return (
    <CreateGlossaryShell
      tab={tab}
      editComponent={EditGlossaryEntryForm}
      editComponentProps={{}}
      previewComponent={PreviewGlossaryWithShell}
      previewComponentProps={{}}
    />
  );
};

export default LandmarkForm;
