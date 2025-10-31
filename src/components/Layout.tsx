import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, CssBaseline, Container, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

export default function Layout({ title, children }: { title?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title || 'Personal Finance'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* space for AppBar */}
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
