import React, { useState, useRef } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import './App.css';
import SnakeForm from './SnakeForm';

const theme = createTheme({
  palette: {
    primary: { main: '#4a7c3f' },
  },
});

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setResult(null);
    setError(null);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file.');
      return;
    }
    setUploading(true);
    setResult(null);
    setError(null);
    try {
      // Replace the URL below with your backend endpoint
      const formData = new FormData();
      formData.append('image', selectedFile);
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setResult(data.result || 'No result returned.');
    } catch (err) {
      setError('Failed to upload or identify the snake.');
    } finally {
      setUploading(false);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App" style={{ minHeight: '100vh', background: '#f5f0e8', color: '#2c2008', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, paddingBottom: 24 }}>
        <header style={{ width: '100%', maxWidth: 500, textAlign: 'center', paddingLeft: 8, paddingRight: 8 }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 16, color: '#2c2008' }}>SnakeSnap</h1>
          <SnakeForm />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
