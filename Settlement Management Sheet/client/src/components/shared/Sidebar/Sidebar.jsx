import React, { useContext, useState } from 'react';

import { useDynamicSidebar } from '../../../context/SidebarContext';

import TitledCollapse from '../TitledCollapse/TitledCollapse';
import { Button, Typography, Box } from '@mui/material';

const Sidebar = ({ sidebarSx }) => {
  const { content, handlers } = useDynamicSidebar();

  const generateContent = (content) => {
    return content.map((item, i) => {
      if (item.type === 'titledCollapse') {
        return (
          <TitledCollapse
            key={i}
            title={item.name}
            titleType={item.header}
            sx={item.sx || {}}
          >
            {generateContent(item.content)}
          </TitledCollapse>
        );
      }
      if (item.type === 'text') {
        return item.span ? (
          item.content.split('*').map((text, i) =>
            i % 2 === 0 ? (
              <Typography
                variant={item.variant || 'body1'}
                key={i}
                component="span"
                sx={item.sx || {}}
              >
                {text}
              </Typography>
            ) : (
              <Typography
                variant={item.variant || 'body1'}
                key={i}
                component="span"
                sx={item.sx || {}}
                style={{ fontWeight: 'bold' }}
              >
                <strong>{text}</strong>
              </Typography>
            )
          )
        ) : (
          <Box sx={item.sx || {}}>
            {' '}
            {item.content.split('*').map((text, i) =>
              i % 2 === 0 ? (
                <Typography
                  variant={item.variant || 'body1'}
                  component="span"
                  key={i}
                  sx={item.sx || {}}
                >
                  {text}
                </Typography>
              ) : (
                <Typography
                  variant={item.variant || 'body1'}
                  component="span"
                  key={i}
                  sx={{ ...item.sx, color: 'primary.main' }}
                  style={{ fontWeight: 'bold' }}
                >
                  <strong>{text}</strong>
                </Typography>
              )
            )}
          </Box>
        );
      }

      if (item.type === 'button') {
        return (
          <Button
            key={i}
            variant={item.variant || 'contained'}
            onClick={handlers[item.onClick]}
            sx={item.sx || {}}
          >
            {item.label}
          </Button>
        );
      }

      if (item.type === 'box') {
        return <Box sx={item.sx || {}}>{generateContent(item.content)}</Box>;
      }
    });
  };

  return <Box sx={sidebarSx ? sidebarSx : {}}>{generateContent(content)}</Box>;
};

export default Sidebar;
