import React from 'react';
import { Box, Typography } from '@mui/material';

const LeaderboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Leaderboard
      </Typography>
      <Typography variant="body1" color="text.secondary">
        User rankings and statistics will be displayed here.
      </Typography>
    </Box>
  );
};

export default LeaderboardPage; 