import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Tab, Tabs, TextField, Typography } from '@mui/material';
import { setTokens } from './auth';

const API = 'http://localhost:8000/api';

const fieldSx = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    color: '#2c2008',
    background: '#fff8ee',
    borderRadius: 1,
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)', borderWidth: 1 },
  },
  '& .MuiInputLabel-root': { color: '#2c2008', background: '#fff8ee', px: 0.5 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2c2008' },
};

async function loginRequest(email: string, password: string) {
  const res = await fetch(`${API}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email.trim().toLowerCase(), password }),
  });
  if (!res.ok) throw new Error('Invalid email or password.');
  const data = await res.json();
  setTokens(data.access, data.refresh);
}

export default function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, v: number) => {
    setTab(v);
    setError(null);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginRequest(email, password);
      onLogin();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Registration failed.');
      }
      await loginRequest(email, password);
      onLogin();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 0) handleLogin(); else handleRegister();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', pt: 6, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, textAlign: 'center', color: '#2c2008' }}>
        SnakeSnap
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: '#5a4a2a' }}>
        Record and identify snake sightings
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          autoComplete="email"
          sx={fieldSx}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoComplete={tab === 0 ? 'current-password' : 'new-password'}
          sx={fieldSx}
        />
        {tab === 1 && (
          <Typography variant="caption" sx={{ display: 'block', mb: 2, color: '#5a4a2a' }}>
            Password must be at least 8 characters.
          </Typography>
        )}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !email || !password}
          sx={{ py: 1.5 }}
        >
          {loading
            ? <CircularProgress size={22} sx={{ color: '#fff' }} />
            : tab === 0 ? 'Login' : 'Create Account'}
        </Button>
      </form>
    </Box>
  );
}
