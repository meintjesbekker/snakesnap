import React, { useState } from 'react';
import {
  Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Slider, TextField, Typography, Switch
} from '@mui/material';

const patternOptions = ["Stripes", "Bands", "Spots", "Solid", "Diamond", "Speckled"];
const behaviourOptions = ["Calm", "Hiding", "Climbing", "Swimming", "Defensive", "Striking", "Fleeing"];
const conditionOptions = ["Healthy", "Shedding", "Injured", "Parasites"];
const microHabitatOptions = ["Grass", "Under rock", "Leaf litter", "Tree", "Water edge", "Path", "Wall"];
const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Windy", "Hot", "Cold"];

export default function SnakeForm() {
  const [snakeName, setSnakeName] = useState('');
  const [length, setLength] = useState(50);
  const [thickness, setThickness] = useState('medium');
  const [pattern, setPattern] = useState<string[]>([]);
  const [headShape, setHeadShape] = useState('');
  const [eyeType, setEyeType] = useState('');
  const [behaviour, setBehaviour] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const [locationType, setLocationType] = useState('');
  const [microHabitat, setMicroHabitat] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState('afternoon');
  const [weather, setWeather] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(50);
  const [numSnakes, setNumSnakes] = useState(1);
  const [notes, setNotes] = useState('');
  const [addToDatabase, setAddToDatabase] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Helper for multi-checkbox
  const handleMultiCheckbox = (value: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Submit form data to backend
    alert('Form submitted!');
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>Snake Details</Typography>
      <form onSubmit={handleSubmit}>
        {/* Snake Name Section - moved to top for visibility */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Snake Name (optional)"
            value={snakeName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSnakeName(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ input: { color: '#222', background: '#fff' }, label: { color: '#222' } }}
          />
        </Box>

        {/* Image Upload Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Snake Photo</Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ mb: 2 }}
          >
            {imageFile ? 'Change Photo' : 'Upload Photo'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
            </Box>
          )}
        </Box>

        {/* Sliders Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Snake Measurements</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Estimated Length: {length} cm</Typography>
            <Slider
              value={length}
              min={10}
              max={300}
              onChange={(_event: Event, v: number | number[]) => setLength(v as number)}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Confidence: {confidence}%</Typography>
            <Slider
              value={confidence}
              min={0}
              max={100}
              onChange={(_event: Event, v: number | number[]) => setConfidence(v as number)}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ mb: 0 }}>
            <Typography gutterBottom>Number of Snakes: {numSnakes}</Typography>
            <Slider
              value={numSnakes}
              min={1}
              max={10}
              step={1}
              onChange={(_event: Event, v: number | number[]) => setNumSnakes(v as number)}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>

        {/* Thickness */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Body Thickness</InputLabel>
            <Select value={thickness} label="Body Thickness" onChange={(e: any) => setThickness(e.target.value)}>
              <MenuItem value="thin">Thin</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="thick">Thick</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Pattern Chips */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Colour Pattern</Typography>
          <FormGroup row>
            {patternOptions.map(p => (
              <FormControlLabel
                key={p}
                control={<Checkbox checked={pattern.includes(p)} onChange={() => handleMultiCheckbox(p, pattern, setPattern)} />}
                label={p}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Head Shape */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Head Shape</InputLabel>
            <Select value={headShape} label="Head Shape" onChange={(e: any) => setHeadShape(e.target.value)}>
              <MenuItem value="">Select...</MenuItem>
              <MenuItem value="rounded">Rounded</MenuItem>
              <MenuItem value="triangular">Triangular</MenuItem>
              <MenuItem value="narrow">Narrow</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Eye Type */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Eye Type</InputLabel>
            <Select value={eyeType} label="Eye Type" onChange={(e: any) => setEyeType(e.target.value)}>
              <MenuItem value="">Select...</MenuItem>
              <MenuItem value="round">Round pupil</MenuItem>
              <MenuItem value="vertical">Vertical pupil</MenuItem>
              <MenuItem value="unknown">Not visible</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Behaviour */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Behaviour</Typography>
          <FormGroup row>
            {behaviourOptions.map(b => (
              <FormControlLabel
                key={b}
                control={<Checkbox checked={behaviour.includes(b)} onChange={() => handleMultiCheckbox(b, behaviour, setBehaviour)} />}
                label={b}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Condition */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Condition</Typography>
          <FormGroup row>
            {conditionOptions.map(c => (
              <FormControlLabel
                key={c}
                control={<Checkbox checked={condition.includes(c)} onChange={() => handleMultiCheckbox(c, condition, setCondition)} />}
                label={c}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Location Type */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Location Type</InputLabel>
            <Select value={locationType} label="Location Type" onChange={(e: any) => setLocationType(e.target.value)}>
              <MenuItem value="garden">Garden</MenuItem>
              <MenuItem value="forest">Forest</MenuItem>
              <MenuItem value="roadside">Roadside</MenuItem>
              <MenuItem value="farmland">Farmland</MenuItem>
              <MenuItem value="wetland">Wetland</MenuItem>
              <MenuItem value="urban">Urban</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Microhabitat */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Micro‑Habitat</Typography>
          <FormGroup row>
            {microHabitatOptions.map(m => (
              <FormControlLabel
                key={m}
                control={<Checkbox checked={microHabitat.includes(m)} onChange={() => handleMultiCheckbox(m, microHabitat, setMicroHabitat)} />}
                label={m}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Time of Day */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Time of Day</InputLabel>
            <Select value={timeOfDay} label="Time of Day" onChange={(e: any) => setTimeOfDay(e.target.value)}>
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="afternoon">Afternoon</MenuItem>
              <MenuItem value="evening">Evening</MenuItem>
              <MenuItem value="night">Night</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Weather */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Weather</Typography>
          <FormGroup row>
            {weatherOptions.map(w => (
              <FormControlLabel
                key={w}
                control={<Checkbox checked={weather.includes(w)} onChange={() => handleMultiCheckbox(w, weather, setWeather)} />}
                label={w}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Add to Database */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={<Switch checked={addToDatabase} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddToDatabase(e.target.checked)} />}
            label="Add to database (unknown species)"
          />
        </Box>

        {/* Comments Section - moved to bottom for clarity */}
        <Box sx={{ mb: 3, mt: 3 }}>
          <TextField
            label="Comments (optional)"
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ input: { color: '#222', background: '#fff' }, label: { color: '#222' } }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>Submit Snake</Button>
        </Box>
      </form>
    </Box>
  );
}
