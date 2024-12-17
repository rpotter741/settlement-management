import React from 'react';

const TagTable = () => {
  const tags = [
    { tag: '{{settlementName}}', description: 'The name of the settlement.' },
    { tag: '{{settlementType}}', description: 'The type of the settlement.' },
    {
      tag: '{{building}}',
      description:
        "A building in the settlement. Defaults to 'the building' if unspecified. For example, `{{tavern}}` (default: the tavern) or `{{blacksmith}}` (default: the blacksmith).",
    },
    {
      tag: '{{river}}',
      description:
        "A named river near or in the settlement. Defaults to 'the river' if unspecified.",
    },
    {
      tag: '{{mountain}}',
      description:
        "A named mountain near or in the settlement. Defaults to 'the mountain' if unspecified.",
    },
    {
      tag: '{{forest}}',
      description:
        "A named forest near or in the settlement. Defaults to 'the forest' if unspecified.",
    },
    {
      tag: '{{lake}}',
      description:
        "A named lake near or in the settlement. Defaults to 'the lake' if unspecified.",
    },
    {
      tag: '{{swamp}}',
      description:
        "A named swamp near or in the settlement. Defaults to 'the swamp' if unspecified.",
    },
    {
      tag: '{{desert}}',
      description:
        "A named desert near or in the settlement. Defaults to 'the desert' if unspecified.",
    },
    {
      tag: '{{cave}}',
      description:
        "A named cave near or in the settlement. Defaults to 'the cave' if unspecified.",
    },
    {
      tag: '{{customTag}}',
      description:
        'Custom tags defined by the DM. Settlements may have any number of custom tags. This allows seamless integration with highly-customized events and settlements.',
    },
  ];

  return (
    <table className="table-auto border-collapse w-full">
      <thead>
        <tr>
          <th className="border px-4 py-2">Tag</th>
          <th className="border px-4 py-2">Description</th>
        </tr>
      </thead>
      <tbody>
        {tags.map((tag, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{tag.tag}</td>
            <td className="border px-4 py-2">{tag.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TagTable;
