import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          pt: 3, 
          pb: 3,
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 