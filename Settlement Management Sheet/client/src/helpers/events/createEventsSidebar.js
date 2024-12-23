/*
  onClick indexes:

  0: Add Attribute
  1: Add Threshold
  2: Add Dependency

*/

const eventSidebar = [
  {
    type: 'text',
    variant: 'h4',
    content: 'Glossary',
    sx: { my: 2 },
  },
  {
    type: 'titledCollapse',
    header: 'h5',
    name: 'Phase Types',
    content: [
      {
        type: 'text',
        content:
          'Phase Types are how you can categorize your phases and serve as a high-level overview as to the way the phase will impact the game. There are four phase types available: *Immediate*, *Active*, *Passive*, and *Indefinite*.',
        sx: { mb: 2 },
      },
      {
        type: 'text',
        variant: 'h5',
        content: 'Immediate',
        sx: {
          mb: 2,
          color: 'secondary.light',
          fontWeight: 'bold',
        },
      },
      {
        type: 'text',
        // span: true,
        content:
          "Immediate Phases are those that happen instantly. There is no long term effect on the settlement, though that doesn't mean the costs or rewards cannot be highly impactful. Immediate phases are typically *one-off* and/or *simple events*, and can cover all sorts of things from a natural disaster to a building fire to a theft at the market to a rumor being spread. Immediate phases should be reserved for those things that have no opportunity to delay or prevent from happening.",
        sx: { mb: 2 },
      },
      {
        type: 'text',
        content:
          'Immediate Phases are often used in conjunction with *Active Phases* and *Passive Phases* to create a more complex narrative that can be a lot more engaging than a simple event, typically being used as the first phase.',
      },
      {
        type: 'titledCollapse',
        header: 'h5',
        name: 'Example Immediate Phase',
        content: [
          {
            type: 'text',
            content: '*Phase Name*: Granary Fire',
          },
          {
            type: 'text',
            content: '*Phase Type*: Immediate',
          },
          {
            type: 'text',
            content: '*Description*: A fire breaks out at the Granary.',
          },
        ],
      },
    ],
  },
];

export default eventSidebar;
