import React from 'react';

const ThresholdsDetails = () => {
  return (
    <details className="border border-accent rounded-lg p-4 bg-background text-primary shadow-md mb-4">
      <summary className="text-accent-two font-bold cursor-pointer hover:underline mb-2 max-w-3xl min-w-3xl w-3xl">
        About Thresholds
      </summary>
      <p className="mb-4">
        Thresholds are used to determine when an event should trigger. They can
        be used to create complex narratives that automatically progress,
        allowing you to create dynamic and engaging stories without the mental
        overhead of tracking so many details.
      </p>
    </details>
  );
};

export default ThresholdsDetails;
