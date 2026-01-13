import React from 'react';
import { Typography, Tooltip } from '@mui/material';

export interface ContentChunk {
  type: 'text' | 'strong' | 'tooltip';
  value?: string; // For 'text' and 'strong' types
  title?: string; // For 'tooltip' type
  onClick?: () => void; // For 'tooltip' type
}

const TextWithTooltipLink: React.FC<{ content: ContentChunk[] }> = ({
  content,
}) => {
  return (
    <Typography component="span">
      {content.map((chunk, index) => {
        if (chunk.type === 'text')
          return <span key={index}>{chunk.value}</span>;

        if (chunk.type === 'strong')
          return <strong key={index}>{chunk.value}</strong>;

        if (chunk.type === 'tooltip') {
          return (
            <Tooltip key={index} title={chunk.title} arrow>
              <Typography
                component="span"
                sx={{
                  textDecoration: 'underline',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={chunk.onClick}
              >
                {chunk.value}
              </Typography>
            </Tooltip>
          );
        }

        return null;
      })}
    </Typography>
  );
};

export default TextWithTooltipLink;
