import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import { Link } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 210;

export default function PermanentDrawerLeft({children}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Finance-app
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem disablePadding>
              <Link to="" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton sx={{ width: '100%' }}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link to="/transactions" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton sx={{ width: '100%' }}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Transactions" />
                </ListItemButton>
              </Link>
            </ListItem>  
            <ListItem disablePadding>
              <Link to="saving-plans/" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton sx={{ width: '100%' }}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Saving plans" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link to="bank-accounts/" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton sx={{ width: '100%' }}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Accounts" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3}}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
