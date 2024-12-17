import React from 'react';

const EventTagDetails = () => {
  return (
    <details className="border border-accent rounded-lg p-4 bg-background text-primary shadow-md mb-4">
      <summary className="text-accent-two font-bold cursor-pointer hover:underline mb-2 max-w-3xl min-w-3xl w-3xl">
        About Event Tags
      </summary>
      <p className="mb-4">
        Event tags are used to categorize events. DMs use these same tags to
        specify narrative elements that are relevant to the settlement and
        campaign as a whole. By tagging events in this way, you enable dynamic
        (and more importantly, thematic) event generation.
      </p>
    </details>
  );
};

export default EventTagDetails;
