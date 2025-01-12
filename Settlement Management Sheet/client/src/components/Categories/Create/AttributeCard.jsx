import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ValidatedInput from '../../utils/ValidatedTextArea/ValidatedInput';
import ValidatedTextField from '../../utils/ValidatedTextArea/ValidatedTextArea';
import FloatingSelect from '../../shared/FloatingSelect/FloatingSelect';

const AttributeCard = ({ attribute, setAttribute }) => {
  return (
    <Box>
      <ValidatedInput
        name="attribute name"
        label="Attribute Name"
        variant="standard"
        validated={attribute.name.length > 3}
        value={attribute.name}
        onChange={(newName) => setAttribute({ ...attribute, name: newName })}
        validation={(value) => value.length > 3}
        required
        tooltipText="Attribute names are unique and can not be changed once created. If an attribute with the same name already exists in your custom assets, it will be overwritten."
      />
      <ValidatedTextField
        name="attribute description"
        label="Attribute Description"
        validated={attribute.description.length > 3}
        value={attribute.description}
        onChange={(newDescription) =>
          setAttribute({ ...attribute, description: newDescription })
        }
        validation={(value) => value.length > 3}
        required
        multiline
      />
      <Button variant="contained" color="primary" onClick={() => {}}>
        Save
      </Button>
    </Box>
  );
};

export default AttributeCard;
