import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { auth } from '../services/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (localStorage.getItem('token')) navigate(from, { replace: true });
  }, [navigate, from]);

  const submit = async () => {
    setErr('');
    if (!email || !password) {
      setErr('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const res = await auth.login(email, password);
      localStorage.setItem('token', res.access_token);
      navigate(from, { replace: true });
    } catch (e: any) {
      const message = e?.response?.data?.message || e?.response?.data || e?.message || 'Login failed';
      setErr(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">Sign in</Typography>
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth autoComplete="email" />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth autoComplete="current-password" />
        {err && <Typography color="error" sx={{ fontSize: 13 }}>{err}</Typography>}
        <Button variant="contained" onClick={submit} disabled={loading}>{loading ? 'Signing in…' : 'Login'}</Button>
        <Button variant="text" onClick={() => navigate('/register')}>Create account</Button>
      </Box>
    </Container>
  );
}
