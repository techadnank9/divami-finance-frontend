import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { auth } from '../services/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || '/dashboard';

  const submit = async () => {
    try {
      const res = await auth.login(email, password);
      localStorage.setItem('token', res.access_token);
      navigate(from, { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data || e.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">Sign in</Typography>
        <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth />
        {err && <Typography color="error">{err}</Typography>}
        <Button variant="contained" onClick={submit}>Login</Button>
        <Button variant="text" onClick={() => navigate('/register')}>Create account</Button>
      </Box>
    </Container>
  );
}
