import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  emptyCategory,
  emptyThreshold,
  emptyDependency,
  emptyAttribute,
  exampleThresholds,
} from '../../../helpers/categories/emptyCategoryObjects.js';

import React, { useState } from 'react';

const CreateCategory = ({ category, setCategory }) => {
  const [level, setLevel] = useState(1); // Default level is 1

  const handleLevelChange = (e) => {
    const value = Math.max(1, Math.min(20, Number(e.target.value)));
    setLevel(value);
    handleChange('settlementLevel', value);
  };

  const handleChange = (keyPath, value) => {
    const updateNestedObject = (obj, keys, val) => {
      if (keys.length === 1) {
        obj[keys[0]] = val;
        return obj;
      }
      const key = keys[0];
      if (!obj[key]) obj[key] = {};
      obj[key] = updateNestedObject(obj[key], keys.slice(1), val);
      return obj;
    };
    setCategory((prev) => {
      const updatedCategory = { ...prev };
      updateNestedObject(updatedCategory, keyPath.split('.'), value);
      return updatedCategory;
    });
  };

  const handleAddItem = (keyPath, newItem) => {
    setCategory((prev) => {
      const updatedCategory = structuredClone(prev); // Create a deep copy
      const keys = keyPath.split('.');
      const targetArray = keys.reduce((acc, key) => acc[key], updatedCategory);

      if (!Array.isArray(targetArray)) {
        console.error(`${keyPath} is not an array`);
        return prev;
      }

      targetArray.push(newItem);
      return updatedCategory;
    });
  };

  const handleRemoveItem = (keyPath, index) => {
    setCategory((prev) => {
      const updatedCategory = { ...prev }; // Create a shallow copy of the category
      const keys = keyPath.split('.');
      const targetArray = keys.reduce((acc, key) => acc[key], updatedCategory);

      if (Array.isArray(targetArray)) {
        // Replace the original array with a filtered version
        const filteredArray = targetArray.filter((_, i) => i !== index);
        keys.reduce((acc, key, idx) => {
          if (idx === keys.length - 1) {
            acc[key] = filteredArray; // Update the target array
          }
          return acc[key];
        }, updatedCategory);
      }

      return updatedCategory;
    });
  };

  const handleAttributeChange = (updatedAttr, index) => {
    const updatedAttributes = category.attributes.map((attr, i) =>
      i === index ? updatedAttr : attr
    );
    handleChange('attributes', updatedAttributes);
  };

  const exportToJson = () => {
    const jsonString = JSON.stringify(category, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.name || 'custom_category'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '0 auto',
        width: { xs: '100%', sm: '75%', md: '50%' },
        maxHeight: '85vh',
        overflow: 'scroll',
        pt: 2,
      }}
    >
      <Typography variant="h4" sx={{ my: 2 }}>
        Create Category
      </Typography>
      <TextField
        label="Settlement Level"
        value={level}
        onChange={handleLevelChange}
        type="number"
        sx={{ my: 1 }}
      />
      <TextField
        label="Category Name"
        value={category.name}
        onChange={(e) => handleChange('name', e.target.value)}
        sx={{ my: 1 }}
      />
      <Accordion sx={{ width: 'auto', my: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Attributes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Attributes define key characteristics of the category. Each
            attribute contains <strong>base values</strong> and{' '}
            <strong>settlement point costs</strong>. These are used to calculate
            overall category score and its impacts on the settlement.
          </Typography>
          {category.attributes.map((attr, index) => (
            <Typography key={index} variant="body1">
              I'm an attribute!
            </Typography>
          ))}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => handleAddItem('attributes', { ...emptyAttribute })}
          >
            {' '}
            Add Attribute{' '}
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: 'auto', my: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Thresholds</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Thresholds specify the score, based on a 10-point scale, for the
            category rating. See below for details on <strong>Survival</strong>
            's thresholds.
          </Typography>
          <Accordion sx={{ width: 'auto', my: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Survival Thresholds</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: 'flex',
                  gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                  },
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                  {exampleThresholds.map(({ max, rating }) => (
                    <Grid key={max} item xs={6}>
                      <Typography variant="body1">
                        <strong>{max}</strong>: {rating}
                      </Typography>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ px: 2 }}>
                      In this case, if the score is at or below{' '}
                      <strong>2.9</strong>, the category is
                      <strong> Endangered</strong>. These ratings are used for
                      player feedback about the status of the category and may
                      be tied to other categories to adjust their scores (see{' '}
                      <strong>Dependencies</strong> below). Scores are
                      automatically calculated based on current values, bonuses,
                      and max values.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
          //thresholds here
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CreateCategory;
