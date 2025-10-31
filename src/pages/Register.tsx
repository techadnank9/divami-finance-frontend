import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { auth } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await auth.register(email, password, name);
      localStorage.setItem('token', res.access_token);
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data || e.message || 'Register failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">Register</Typography>
        <TextField label="Name" value={name} onChange={e=>setName(e.target.value)} fullWidth />
        <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth />
        {err && <Typography color="error">{err}</Typography>}
        <Button variant="contained" onClick={submit}>Register</Button>
        <Button variant="text" onClick={() => navigate('/login')}>Have an account? Login</Button>
      </Box>
    </Container>
  );
}
