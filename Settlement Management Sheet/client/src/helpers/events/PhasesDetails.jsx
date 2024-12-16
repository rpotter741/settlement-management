import React from 'react';

const PhasesDetails = () => {
  return (
    <details>
      <summary className="text-accent-two font-bold cursor-pointer hover:underline mb-2">
        About Phases
      </summary>
      <p className="mb-4">
        Phases describe what happens during an event. They can be used to craft
        complex narratives that automatically progress, allowing you to create
        dynamic and engaging stories without the mental overhead of tracking so
        many details.
      </p>
    </details>
  );
};

export default PhasesDetails;
