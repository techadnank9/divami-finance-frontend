import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, CssBaseline, Container, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

export default function Layout({ title, children }: { title?: string; children: React.ReactNode }) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(isMdUp);

  // keep drawer state in sync when breakpoint changes
  React.useEffect(() => {
    setOpen(isMdUp);
  }, [isMdUp]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => setOpen((s) => !s)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title ?? 'Personal Finance'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar open={open} onClose={() => setOpen(false)} variant={isMdUp ? 'persistent' : 'temporary'} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* spacer for app bar */}
        <Container maxWidth="xl" sx={{ pb: 6 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
