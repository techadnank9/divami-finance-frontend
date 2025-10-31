import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, IconButton, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar({ open, onClose }: { open: boolean; onClose: ()=>void }) {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <IconButton onClick={onClose}><MenuIcon/></IconButton>
          <Typography variant="h6">Finance</Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton onClick={()=>navigate('/dashboard')}>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={()=>navigate('/transactions')}>
          <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItemButton>
        <ListItemButton onClick={()=>navigate('/budgets')}>
          <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
          <ListItemText primary="Budgets" />
        </ListItemButton>
      </List>
      <Box sx={{ flex: 1 }} />
      <Divider />
      <List>
        <ListItemButton onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
