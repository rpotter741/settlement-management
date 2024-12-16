import React from 'react';

const ConditionsExplained = () => {
  return (
    <details className="border border-accent rounded-lg p-4 bg-background text-primary shadow-md mb-4">
      <summary className="text-accent-two font-bold cursor-pointer hover:underline mb-2 max-w-3xl min-w-3xl w-3xl">
        About Conditions
      </summary>
      <div className="mt-2">
        <p className="mb-4">
          Frequency and thresholds help determine how often an event gets
          recommended to the DM. Events are weighted based on their frequency:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong className="text-accent">Very Rare:</strong>
            <span className="ml-2">1%–5% chance</span>
          </li>
          <li>
            <strong className="text-accent">Rare:</strong>
            <span className="ml-2">6%–15% chance</span>
          </li>
          <li>
            <strong className="text-accent">Occasional:</strong>
            <span className="ml-2">16%–30% chance</span>
          </li>
          <li>
            <strong className="text-accent">Frequent:</strong>
            <span className="ml-2">31%–60% chance</span>
          </li>
          <li>
            <strong className="text-accent">Very Frequent:</strong>
            <span className="ml-2">61%–90% chance</span>
          </li>
        </ul>
        <p>
          These percentages don’t mean an event will trigger that often.
          Instead, they act as <span className="font-semibold">weights </span>
          when thresholds are checked, increasing or decreasing the likelihood
          of the event being selected. Use these to balance your campaign's
          pacing and keep the narrative engaging!
        </p>
        <p className="mt-4">
          Thresholds are used to determine when an event should trigger. They
          can be used to create complex narratives that automatically progress,
          allowing you to create dynamic and engaging stories without the mental
          overhead of tracking so many details.
        </p>
      </div>
    </details>
  );
};

export default ConditionsExplained;
