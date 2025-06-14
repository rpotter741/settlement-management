import React from 'react';
import ToolInput, { ToolInputConfig } from '../DynamicForm/ToolInput.js';

interface EditNameDescriptionProps {
  fields: {
    name: ToolInputConfig;
    description: ToolInputConfig;
  };
}

const EditNameDescription: React.FC<EditNameDescriptionProps> = ({
  fields,
}) => {
  return (
    <>
      <ToolInput
        inputConfig={fields.name}
        style={{ gridColumn: 'span 3', px: 1 }}
      />
      <ToolInput
        inputConfig={fields.description}
        style={{ gridColumn: 'span 3', px: 1 }}
        multiline
      />
    </>
  );
};

export default EditNameDescription;
