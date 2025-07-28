import React from 'react';
import { Box, Typography } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        User profile, badges, and progress timeline will be shown here.
      </Typography>
    </Box>
  );
};

export default ProfilePage; 