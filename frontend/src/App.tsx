import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import './App.css';
import AuthScreen from './AuthScreen';
import SnakeForm from './SnakeForm';
import { clearTokens, isLoggedIn } from './auth';

const theme = createTheme({
  palette: {
    primary: { main: '#4a7c3f' },
  },
});

function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const handleLogin = () => setLoggedIn(true);

  const handleLogout = () => {
    clearTokens();
    setLoggedIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{ minHeight: '100vh', background: '#f5f0e8', color: '#2c2008', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, paddingBottom: 24 }}>
        <div style={{ width: '100%', maxWidth: 500, paddingLeft: 8, paddingRight: 8 }}>
          {loggedIn
            ? <SnakeForm onLogout={handleLogout} />
            : <AuthScreen onLogin={handleLogin} />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
