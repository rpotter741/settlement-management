import React from 'react';
import TagTable from './TagTable';

const DescriptionDetails = () => {
  return (
    <details className="border border-accent rounded-lg p-4 bg-background text-primary shadow-md mb-4">
      <summary className="text-accent-two font-bold cursor-pointer hover:underline mb-2 max-w-3xl min-w-3xl w-3xl">
        About Descriptions
      </summary>
      <p className="mb-4">
        Descriptions are used to give context to an event. They can be used to
        create complex narratives that automatically progress, allowing you to
        create dynamic and engaging stories without the mental overhead of
        tracking so many details.
      </p>
      <h3 className="text-2xl font-bold">Narrative Integration</h3>
      <p className="mb-4">
        By wrapping words in double curly braces, you can reference other parts
        of the narrative. For example, if you want to reference the settlement's
        name, you could write <strong>{'{{settlementName}}'}</strong> and it
        would be replaced with the actual name of the settlement when the event
        is activated. Writing descriptions (and flavor text!) in this way allows
        you to create engaging narratives that dynamically react to the
        settlement, whether its the one you're writing this event for, or any of
        the others you manage now or in the future.
      </p>
      <details>
        <summary className="text-secondary font-bold cursor-pointer hover:underline mb-2">
          List of Supported Tags
        </summary>
        <TagTable />
      </details>
    </details>
  );
};

export default DescriptionDetails;
