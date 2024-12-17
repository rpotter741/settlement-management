import React, { useState } from 'react';
import Switch from '../../../shared/Switch/Switch';

const categories = {
  Climate: ['Arid', 'Temperate', 'Cold', 'Humid', 'Rainy', 'Snowy'],
  Biome: ['Forest', 'Desert', 'Mountain', 'Swamp', 'Grassland', 'Urban'],
  Theme: [
    'Arcane',
    'Political',
    'Economic',
    'Exploration',
    'Survival',
    'Mystery',
    'Conflict',
    'Diplomacy',
  ],
  Miscellaneous: [
    'Festival',
    'Invasion',
    'Natural Disaster',
    'Rebellion',
    'Curse',
    'Blessing',
    'Seasonal',
  ],
};

const EventTagsTable = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewSelected, setViewSelected] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(categories).reduce((acc, category) => {
      acc[category] = true; // Initially, all categories are expanded
      return acc;
    }, {})
  );

  const toggleTag = (category, tag) => {
    const tagObject = { category, tag };
    setSelectedTags((prev) =>
      prev.some((t) => t.category === category && t.tag === tag)
        ? prev.filter((t) => !(t.category === category && t.tag === tag))
        : [...prev, tagObject]
    );
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredCategories = Object.entries(categories).reduce(
    (acc, [category, tags]) => {
      const filteredTags = tags.filter((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredTags.length) acc[category] = filteredTags;
      return acc;
    },
    {}
  );

  return (
    <div className="w-full p-4">
      <h3 className="text-xl font-bold mb-4">Event Tags</h3>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full mb-4"
      />

      {/* Toggle View Button */}
      <button
        onClick={() => setViewSelected(!viewSelected)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {viewSelected ? 'View All Tags' : 'View Selected Tags'}
      </button>

      {/* Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Tag</th>
            <th className="border border-gray-300 px-4 py-2">
              {viewSelected ? 'Remove' : 'Select'}
            </th>
          </tr>
        </thead>
        <tbody>
          {viewSelected
            ? selectedTags.map((tag, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {tag.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {tag.tag}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <Switch
                      checked={selectedTags.some(
                        (t) => t.category === tag.category && t.tag === tag.tag
                      )}
                      onChange={() => toggleTag(tag.category, tag.tag)}
                    />
                  </td>
                </tr>
              ))
            : Object.entries(filteredCategories).map(([category, tags]) => (
                <React.Fragment key={category}>
                  {/* Category Row */}
                  <tr
                    className="bg-gray-200 cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <td
                      colSpan="3"
                      className="border border-gray-300 px-4 py-2 font-bold"
                    >
                      {category} {expandedCategories[category] ? '-' : '+'}
                    </td>
                  </tr>
                  {/* Tag Rows */}
                  {expandedCategories[category] &&
                    tags.map((tag) => (
                      <tr key={tag}>
                        <td className="border border-gray-300 px-4 py-2">
                          {category}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {tag}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <Switch
                            checked={selectedTags.some(
                              (t) => t.category === category && t.tag === tag
                            )}
                            onChange={() => toggleTag(category, tag)}
                          />
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTagsTable;
