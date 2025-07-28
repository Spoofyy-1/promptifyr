import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Challenge {id}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Individual challenge interface with prompt playground will be implemented here.
      </Typography>
    </Box>
  );
};

export default ChallengePage; 