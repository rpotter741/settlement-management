import { Box, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import useSubTypePropertyCreator, {
  SubTypePropertyTypeOptions,
} from './hooks/useSubTypePropertyCreator.js';
import CreateNewButton from './components/CreateNewButton.js';
import SidebarProperty from './components/SidebarProperty.js';
import { deleteSubTypePropertyThunkRoot } from '@/app/thunks/glossary/subtypes/properties/removeSubTypePropertyThunk.js';
import { dispatch } from '@/app/constants.js';

const SubTypePropertyCreator = ({
  openRelay,
  setActiveProperty,
  activeProperty,
}: {
  openRelay?: ({
    data,
    status,
  }: {
    data: any;
    status: 'complete' | 'pending';
  }) => void;
  setActiveProperty?: (propertyId: string) => void;
  activeProperty?: string | null;
}) => {
  const { searchTerm, setSearchTerm, allProperties, addProperty } =
    useSubTypePropertyCreator();

  const handlePropertyClick = (propertyId: string) => {
    openRelay && openRelay({ data: { propertyId }, status: 'complete' });
    setActiveProperty && setActiveProperty(propertyId);
  };

  const handlePropertyDeletion = useCallback(
    (propertyId: string) => {
      dispatch(
        deleteSubTypePropertyThunkRoot({
          propertyId: propertyId,
        })
      );
      openRelay &&
        openRelay({
          data: {
            setActiveProperty: null,
          },
          status: 'complete',
        });
    },
    [openRelay]
  );

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <>
      <CreateNewButton
        onAdd={addProperty}
        selectOptions={SubTypePropertyTypeOptions}
        label="Add Property"
      />
      <TextField
        sx={{ my: 2 }}
        fullWidth
        size="small"
        placeholder="Search Properties..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Box sx={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'scroll' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'scroll',
          }}
        >
          {allProperties.map((property, n: number) => (
            <SidebarProperty
              key={property.id}
              propertyId={property.id}
              index={n}
              handlePropertyClick={handlePropertyClick}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
              isActive={activeProperty === property.id}
              handlePropertyDeletion={handlePropertyDeletion}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default SubTypePropertyCreator;
