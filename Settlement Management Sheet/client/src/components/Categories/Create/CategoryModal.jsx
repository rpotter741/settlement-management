import React from 'react';

import Grid from '@mui/material/Grid2';
import { Box, Card, Typography, Button } from '@mui/material';

import AttributeCard from './AttributeCard';

import ValidatedInput from '../../utils/ValidatedTextArea/ValidatedInput';
import ValidatedTextField from '../../utils/ValidatedTextArea/ValidatedTextArea';

const CategoryModal = ({ category, setCategory, setOpen }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        height: '100%',
        overflowY: 'scroll',
        boxShadow: 3,
        borderRadius: 4,
        p: 2,
        mx: 'auto',
        backgroundColor: 'background.default',
        width: ['100%', '80%', '60%', '44%'],
      }}
    >
      <Typography variant="h3" sx={{ mb: 2 }}>
        Custom Category
      </Typography>
      <ValidatedInput
        name="category name"
        label="Category Name"
        variant="outlined"
        validated={category.name.length > 3}
        value={category.name}
        onChange={(newName) => setCategory({ ...category, name: newName })}
        validation={(value) => value.length > 3}
        required
        style={{ width: '100%' }}
      />
      <ValidatedTextField
        name="category description"
        label="Category Description"
        variant="outlined"
        multiline
        validated={category.description.length > 3}
        value={category.description}
        onChange={(newDescription) =>
          setCategory({ ...category, description: newDescription })
        }
        validation={(value) => value.length > 3}
        required
        style={{ width: '100%' }}
      />
      <Typography variant="h4" sx={{ mt: 2 }}>
        Attributes
      </Typography>
      {category.attributes.map((attr, index) => (
        <AttributeCard
          key={index}
          attribute={attr}
          setAttribute={(updatedAttr) =>
            setCategory({
              ...category,
              attributes: category.attributes.map((a, i) =>
                i === index ? updatedAttr : a
              ),
            })
          }
        />
      ))}
    </Card>
  );
};

export default CategoryModal;
