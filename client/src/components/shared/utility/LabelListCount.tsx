const LabelListCount = ({
  label,
  length,
}: {
  label: string;
  length: number;
}) => {
  return (
    <>
      {label} {length > 0 ? `(${length})` : ''}
    </>
  );
};

export default LabelListCount;
