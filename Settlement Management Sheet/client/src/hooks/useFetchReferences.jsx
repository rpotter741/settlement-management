import { useEffect, useState } from 'react';
import queryClient from 'context/QueryClient.js';
import api from 'services/interceptor.js';

const useFetchReferences = (tool, refIds = []) => {
  const [resolved, setResolved] = useState([]);

  useEffect(() => {
    const cached = refIds.map((id) => queryClient.getQueryData([tool, id]));

    const missing = refIds.filter((_, idx) => cached[idx] === undefined);

    if (missing.length > 0) {
      api
        .post('/tools/fetchByIds', {
          tool,
          ids: missing,
        })
        .then(({ data }) => {
          data.forEach((item) => {
            queryClient.setQueryData([tool, item.id], item);
          });
          setResolved(refIds.map((id) => queryClient.getQueryData([tool, id])));
        });
    } else {
      setResolved(cached);
    }
  }, [tool, refIds]);
  return resolved;
};

export default useFetchReferences;
