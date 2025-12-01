import {
  selectActiveId,
  selectGlossaryNodes,
} from '@/app/selectors/glossarySelectors.js';
import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import { useRelayChannel } from '@/hooks/global/useRelay.js';
import { Box, Divider, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const MainNIEParser = () => {
  const [graph, setGraph] = useState<any>(null);
  const [anchorMap, setAnchorMap] = useState<any>(null);

  const glossaryId = useSelector(selectActiveId());
  const allNodes = useSelector(selectGlossaryNodes(glossaryId || ''));
  const allSubTypes = useSelector(selectAllSubTypes);

  const onComplete = (data: any) => {
    const { graph, anchorMap } = data;
    setGraph(graph);
    setAnchorMap(anchorMap);
  };

  const graphArray = useMemo(() => {
    return Object.values(graph || {});
  }, [graph]);

  const { data } = useRelayChannel({
    id: 'NIEParser',
    onComplete,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        width: '100%',
        justifyContent: 'start',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ width: '100%', textAlign: 'center' }}
      >
        NIE Parser
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Graph Data:
        </Typography>
        {graphArray.map((node: any, index: number) => (
          <Box
            key={node.id}
            sx={{
              mb: 1,
              backgroundColor:
                index % 2 ? 'background.paper' : 'background.default',
              p: 1,
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              <Typography variant="body2">Name: {node.name}</Typography>
              <Typography variant="body2">
                Primary:{' '}
                {allNodes[node.primaryValue]?.name || node.primaryValue}
              </Typography>
              <Typography variant="body2">
                Secondary:{' '}
                {allNodes[node.secondaryValue]?.name || node.secondaryValue}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ textAlign: 'start' }}>
                Relationships:
              </Typography>
              <Box sx={{ display: 'flex', pl: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', width: '200px' }}
                >
                  Name
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', width: '200px' }}
                >
                  Distance / Score
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', width: '200px' }}
                >
                  Type
                </Typography>
              </Box>
              {Object.entries(node.relationships).map(([relId, relData]) => (
                <Box key={relId} sx={{ pl: 2 }}>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography
                      variant="body2"
                      sx={{ width: '200px', textAlign: 'start' }}
                    >
                      {allNodes[relId]?.name || relId}
                    </Typography>
                    <Typography variant="body2" sx={{ width: '200px' }}>
                      {relData.distance}
                    </Typography>
                    <Typography variant="body2" sx={{ width: '200px' }}>
                      {relData.type}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MainNIEParser;
