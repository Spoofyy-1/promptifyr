import React from 'react';
import { Box, Typography } from '@mui/material';

const ChallengesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Challenges
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Challenge listing and filtering will be implemented here.
      </Typography>
    </Box>
  );
};

export default ChallengesPage; 