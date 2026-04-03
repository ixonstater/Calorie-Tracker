import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

interface AppHeaderProps {
  onFoodDbClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onFoodDbClick }) => (
  <AppBar position="sticky" sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', boxShadow: 0 }}>
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 56 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 10, height: 10, bgcolor: 'primary.main', borderRadius: '50%', mr: 1 }} />
        <Typography variant="h6" color="primary" fontWeight={700}>
          CalTrack
        </Typography>
      </Box>
      <IconButton aria-label="Food DB" color="inherit" onClick={onFoodDbClick}>
        <StorageIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default AppHeader;
