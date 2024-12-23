/*
  onClick indexes:

  0: Add Attribute
  1: Add Threshold
  2: Add Dependency

*/

const categorySidebar = [
  {
    type: 'text',
    variant: 'h4',
    content: 'Glossary',
    sx: { my: 2 },
  },
  {
    type: 'titledCollapse',
    header: 'h5',
    name: 'Attributes',
    content: [
      {
        type: 'text',
        // span: true,
        content:
          'Attributes define key characteristics of the category. Each attribute contains *base values* and *settlement point costs*. These are used to calculate overall category score and its impacts on the settlement.',
        sx: { mb: 2 },
      },
      {
        type: 'button',
        label: 'ADD ATTRIBUTE',
        onClick: 0,
      },
    ],
  },
  {
    type: 'titledCollapse',
    header: 'h5',
    name: 'Thresholds',
    content: [
      {
        type: 'text',
        span: true,
        content:
          "Thresholds specify the score, based on a 10-point scale, for the category rating. See below for details on *Survival*'s thresholds.",
        sx: { mb: 2 },
      },
      {
        type: 'titledCollapse',
        header: 'h6',
        name: 'Survival Thresholds',
        content: [
          {
            type: 'box',
            sx: {
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
              },
              alignItems: 'center',
              justifyContent: 'start',
              gap: 1,
            },
            content: [
              {
                type: 'text',
                content: '*0.9*: Dying',
              },
              {
                type: 'text',
                content: '*2.9*: Endangered',
              },
              {
                type: 'text',
                content: '*4.9*: Unstable',
              },
              {
                type: 'text',
                content: '*6.9*: Stable',
              },
              {
                type: 'text',
                content: '*8.4*: Developing',
              },
              {
                type: 'text',
                content: '*9.2*: Blossoming',
              },
              {
                type: 'text',
                content: '*10*: Flourishing',
              },
            ],
          },
        ],
        sx: { mb: 2 },
      },
      {
        type: 'button',
        label: 'ADD THRESHOLD',
        onClick: 1,
        sx: { mt: 2 },
      },
    ],
  },
  {
    type: 'titledCollapse',
    header: 'h5',
    name: 'Dependencies',
    content: [
      {
        type: 'text',
        content:
          'Dependencies allow you to adjust the score of a category based on the score of another category. For example, if the catefory *Survival* is at *Endangered*, the *Safety* category will have its base score reduced by 30%.',
        sx: { mb: 2 },
      },
      {
        type: 'text',
        content:
          'Dependencies allow you to simulate the hierarchy of categories, ensuring prioritization of certain categories and enabling dynamic adjustments that truly reflect the overall state of the settlement.',
        sx: { mb: 2 },
      },
      {
        type: 'button',
        label: 'ADD DEPENDENCY',
        onClick: 2,
      },
    ],
  },
];

export default categorySidebar;
