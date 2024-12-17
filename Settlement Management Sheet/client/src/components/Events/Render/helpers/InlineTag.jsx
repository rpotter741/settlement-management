const InlineTag = ({ tag, options, onChange }) => {
  return (
    <select
      value={tag}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-1 text-sm"
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
