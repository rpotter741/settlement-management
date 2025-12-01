const fetchSettlementTypes = async () => {
  try {
    const response = await axios.get('/api/settlement-types');
    setSettlementTypes(response.data);

    // Highlight pending types
    const pending = response.data.filter((type) => type.status === 'pending');
    if (pending.length > 0) {
      console.warn(
        'You have settlement types pending setup:',
        pending.map((p) => p.name)
      );
    }
  } catch (err) {
    console.error('Error fetching settlement types:', err);
  }
};

export default fetchSettlementTypes;
