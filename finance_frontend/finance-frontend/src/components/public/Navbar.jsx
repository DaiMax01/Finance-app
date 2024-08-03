// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography,Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Asegúrate de instalar @mui/icons-material si no lo has hecho

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{flexGrow:1}}>
          Finance-app
        </Typography>
        <Button color="inherit" sx={{ ml: 'auto' }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
