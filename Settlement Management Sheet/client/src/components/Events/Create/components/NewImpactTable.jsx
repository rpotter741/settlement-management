import React from 'react';

import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Select,
  MenuItem,
  Switch,
  Button,
  Input,
} from '@mui/material';

import {
  impactKeyOptions,
  impactAttributeOptions,
  impactCategoryOptions,
  impactTypeOptions,
} from '../../../../utility/impactOptions.js';

const NewImpactTable = ({ impacts, setImpacts, position }) => {
  const handleImpactChange = (index, field, value) => {
    const updatedImpacts = impacts.map((impact, i) =>
      i === index ? { ...impact, [field]: value } : impact
    );
    setImpacts(updatedImpacts, position);
  };

  const handleImmutableChange = (index) => {
    const updatedImpacts = impacts.map((impact, i) =>
      i === index ? { ...impact, immutable: !impact.immutable } : impact
    );
    setImpacts(updatedImpacts, index + 1);
  };

  const handleRemoveImpact = (index) => {
    const updatedImpacts = impacts.filter((_, i) => i !== index);
    setImpacts(updatedImpacts, index + 1);
  };

  const getOptions = (type, key) => {
    let options;
    switch (type) {
      case 'type':
        options = impactTypeOptions;
        break;
      case 'category':
        options = impactCategoryOptions[key];
        break;
      case 'attribute':
        options = impactAttributeOptions[key];
        break;
      case 'key':
        options = impactKeyOptions[key];
        break;
      default:
        break;
    }

    if (!options) {
      return [{ value: '', label: 'None' }];
    } else {
      return options;
    }
  };

  return (
    <TableContainer
      component={Box}
      sx={{
        overflowX: 'auto',
        display: 'flex',
        width: '100%',
        flexGrow: 2,
        minWidth: '800px',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'background.default' }}>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Type
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Category
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Attribute
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Key
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Base Amount
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Immutable
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {impacts.map((impact, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor:
                  index % 2 ? 'background.paper' : 'background.default',
              }}
            >
              {/* Type */}
              <TableCell>
                <Select
                  value={impact.type}
                  onChange={(e) => {
                    handleImpactChange(index, 'type', e.target.value);
                  }}
                  fullWidth
                  sx={{ minWidth: '150px' }}
                >
                  {/* Replace this with `impactTypeOptions.map` */}
                  {getOptions('type').map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>

              {/* Category */}
              <TableCell>
                <Select
                  value={impact.category}
                  onChange={(e) =>
                    handleImpactChange(index, 'category', e.target.value)
                  }
                  fullWidth
                  sx={{ minWidth: '150px' }}
                >
                  {/* Replace this with dynamic category options */}
                  {impact.type &&
                    getOptions('category', impact.type).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </TableCell>

              {/* Attribute */}
              <TableCell>
                <Select
                  value={impact.attribute}
                  onChange={(e) =>
                    handleImpactChange(index, 'attribute', e.target.value)
                  }
                  fullWidth
                  sx={{ minWidth: '150px' }}
                >
                  {/* Replace this with dynamic attribute options */}
                  {impact.category &&
                    getOptions('attribute', impact.category).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </TableCell>

              {/* Key */}
              <TableCell>
                <Select
                  value={impact.key}
                  onChange={(e) =>
                    handleImpactChange(index, 'key', e.target.value)
                  }
                  fullWidth
                  sx={{ minWidth: '150px' }}
                >
                  {/* Replace this with dynamic key options */}
                  {impact.category &&
                    getOptions('key', impact.category).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </TableCell>

              {/* Base Amount */}
              <TableCell>
                <Input
                  value={impact.baseAmount}
                  type="number"
                  onChange={(e) =>
                    handleImpactChange(index, 'baseAmount', e.target.value)
                  }
                  sx={{ width: '100%' }}
                />
              </TableCell>

              {/* Immutable */}
              <TableCell align="center">
                <Switch
                  checked={impact.immutable}
                  onChange={() => handleImmutableChange(index)}
                />
              </TableCell>

              {/* Actions */}
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveImpact(index)}
                  size="small"
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NewImpactTable;
