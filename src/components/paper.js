import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

export default function Variants() {
  return (
    <Box
      sx={{
        display: 'flex',
        '& > :not(style)': {
          m: 1,
          width: 1200,
          height: 600,
        },
      }}
    >
      <Paper variant="outlined" square />
    </Box>
  );
}
