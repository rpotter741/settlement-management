import {
  selectActiveId,
  selectGlossaryNodes,
} from '@/app/selectors/glossarySelectors.js';
import { Add, Remove, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { GlossaryNode } from '../../../../../shared/types/index.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { entryTypeIcons } from '@/features/Glossary/utils/glossaryConstants.js';
import getEntriesById from '@/services/glossary/entry/getEntriesById.js';
import { useRelayChannel } from '@/hooks/global/useRelay.js';

const SidePanelNIE = () => {
  const glossaryId = useSelector(selectActiveId());
  const allNodes = useSelector(selectGlossaryNodes(glossaryId || ''));

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<GlossaryNode[]>([]);
  const [search, setSearch] = useState('');

  const { openRelay } = useRelayChannel({
    id: 'NIEParser',
    onComplete: (data) => {},
  });

  const nodeList = useMemo(() => {
    return Object.values(allNodes).sort((a, b) => a.name.localeCompare(b.name));
  }, [allNodes]);

  const astagua = nodeList.find((node) => node.name === 'Astagua');
  const allAstaguaChildren = useMemo(() => {
    if (!astagua) return [];

    function getAllChildren(nodeId: string, nodes: any, collected: any[] = []) {
      const node = nodes[nodeId];
      if (node && node.children) {
        node.children.forEach((child: GlossaryNode) => {
          collected.push(nodes[child.id]);
          getAllChildren(child.id, nodes, collected);
        });
      }
      return collected.sort((a, b) => a.name.localeCompare(b.name));
    }
    return getAllChildren(astagua.id, allNodes).filter(
      (node) => !selected.includes(node)
    );
  }, [astagua, allNodes, selected]);

  const searchedNodes = useMemo(() => {
    if (!search) return allAstaguaChildren;
    return allAstaguaChildren.filter((node) =>
      node.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allAstaguaChildren]);

  const { getAlphaColor } = useTheming();

  const handleProcessing = async () => {
    const data = await getEntriesById({
      nodeIds: selected.map((node) => node.id),
    });
    //
    const { entries, backlinks } = data;
    const worker = new Worker(
      new URL('../../../NIE/nie-worker.ts', import.meta.url),
      {
        type: 'module',
      }
    );
    // // Add error handler first
    worker.onerror = (error) => {
      console.error('Worker error:', error);
    };

    worker.onmessage = (event) => {
      if (event.data.action === 'complete') {
        openRelay({ data: event.data, status: 'complete' });
      }
    };

    // Then post message
    worker.postMessage({
      action: 'buildGraph',
      nodes: selected,
      entries: entries,
      backlinks: backlinks,
    });
  };

  return (
    <Box sx={{ position: 'relative', flex: 1 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        NIE Select List
      </Typography>
      <TextField
        label="Search Nodes"
        variant="outlined"
        size="small"
        sx={{ mb: 2, width: '95%' }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            endAdornment: <Search />,
          },
        }}
      />
      <FixedSizeList
        height={300}
        width={300}
        itemSize={35}
        itemCount={searchedNodes.length}
        overscanCount={8}
      >
        {({ index, style }) => (
          <Box
            style={style}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor:
                hoverIndex === index
                  ? getAlphaColor({
                      color: 'success',
                      key: 'main',
                      opacity: 0.4,
                    })
                  : index % 2 === 0
                    ? 'background.paper'
                    : 'background.default',
              padding: '4px 8px',
              justifyContent: 'space-between',
            }}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {entryTypeIcons[searchedNodes[index].entryType] || null}
            <Typography
              variant="body2"
              sx={{
                width: '50%',
                textAlign: 'start',
                cursor: 'default',
              }}
            >
              {searchedNodes[index].name}
            </Typography>
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setSelected((prev) => [...prev, searchedNodes[index]]);
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>
        )}
      </FixedSizeList>
      <Typography variant="body2" sx={{ p: 2 }}>
        Total Nodes: {allAstaguaChildren.length}
      </Typography>
      <Divider sx={{ borderColor: 'info.main' }} />
      <Button
        variant="contained"
        onClick={() => setSelected([])}
        sx={{ mt: 2, width: '90%' }}
      >
        Clear Selected Nodes
      </Button>
      <Box>
        <Typography variant="body1" sx={{ p: 2 }}>
          Selected Nodes:
        </Typography>
        <Box
          sx={{
            maxHeight: 300,
            overflowY: 'auto',
            minHeight: 300,
            border: 1,
            borderColor: 'divider',
          }}
        >
          {selected.map((node) => (
            <Box
              key={node.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
              }}
            >
              {entryTypeIcons[node.entryType] || null}
              <Typography
                variant="body2"
                sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}
              >
                {node.name}
              </Typography>
              <IconButton
                size="small"
                color="secondary"
                onClick={() => {
                  setSelected((prev) => prev.filter((n) => n.id !== node.id));
                }}
              >
                <Remove fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
      <Button
        variant="contained"
        sx={{ width: '90%', mt: 2 }}
        color="info"
        onClick={handleProcessing}
      >
        Build Maps
      </Button>
    </Box>
  );
};

export default SidePanelNIE;
