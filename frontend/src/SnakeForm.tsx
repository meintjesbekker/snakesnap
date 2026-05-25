import React, { useState } from 'react';
import {
  Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, TextField, Typography, Switch, FormControlLabel
} from '@mui/material';

const patternOptions = ["Stripes", "Bands", "Spots", "Solid", "Diamond", "Speckled"];
const behaviourOptions = ["Calm", "Hiding", "Climbing", "Swimming", "Defensive", "Striking", "Fleeing"];
const conditionOptions = ["Healthy", "Shedding", "Injured", "Parasites"];
const microHabitatOptions = ["Grass", "Under rock", "Leaf litter", "Tree", "Water edge", "Path", "Wall"];
const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Windy", "Hot", "Cold"];

type MultiSelectProps = {
  label: string;
  value: string[];
  options: string[];
  onChange: (e: SelectChangeEvent<string[]>) => void;
};

// Helper for consistent dropdown styling and spacing
const dropdownSx = {
  color: '#222',
  background: '#fff',
  borderRadius: 1,
  mb: 4,
  '& .MuiInputLabel-root': { color: '#222', background: '#fff', px: 0.5 },
  '& .MuiSelect-select': { minHeight: 48, display: 'flex', alignItems: 'center' },
};

// Utility for single-select dropdowns
function SingleSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (e: SelectChangeEvent<string>) => void }) {
  return (
    <FormControl fullWidth sx={dropdownSx}>
      <InputLabel sx={{ color: '#222', background: '#fff', px: 0.5 }}>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        sx={dropdownSx}
        MenuProps={{
          sx: {
            '& .MuiPaper-root': {
              background: '#fff',
              color: '#222',
            },
          },
        }}
      >
        {options.map((option: string) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// Utility for multi-select dropdowns
function MultiSelect({ label, value, options, onChange }: MultiSelectProps) {
  return (
    <FormControl fullWidth sx={dropdownSx}>
      <InputLabel sx={{ color: '#222', background: '#fff', px: 0.5 }}>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={onChange}
        label={label}
        sx={dropdownSx}
        renderValue={(selected) => (selected as string[]).join(', ')}
        MenuProps={{
          sx: {
            '& .MuiPaper-root': {
              background: '#fff',
              color: '#222',
            },
          },
        }}
      >
        {options.map((option: string) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setImageFile(selected);
    if (selected) {
      setImagePreview(URL.createObjectURL(selected));
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
          <SingleSelect
            label="Body Thickness"
            value={thickness}
            options={['Thin', 'Medium', 'Thick']}
            onChange={(e: SelectChangeEvent<string>) => setThickness(e.target.value)}
          />
        </Box>

        {/* Pattern MultiSelect */}
        <MultiSelect
          label="Colour Pattern"
          value={pattern}
          options={patternOptions}
          onChange={(e: SelectChangeEvent<string[]>) => setPattern(e.target.value as string[])}
        />

        {/* Head Shape */}
        <Box sx={{ mb: 3 }}>
          <SingleSelect
            label="Head Shape"
            value={headShape}
            options={['Rounded', 'Triangular', 'Narrow']}
            onChange={(e: SelectChangeEvent<string>) => setHeadShape(e.target.value)}
          />
        </Box>

        {/* Eye Type */}
        <Box sx={{ mb: 3 }}>
          <SingleSelect
            label="Eye Type"
            value={eyeType}
            options={['Round pupil', 'Vertical pupil', 'Not visible']}
            onChange={(e: SelectChangeEvent<string>) => setEyeType(e.target.value)}
          />
        </Box>

        {/* Behaviour MultiSelect */}
        <MultiSelect
          label="Behaviour"
          value={behaviour}
          options={behaviourOptions}
          onChange={(e: SelectChangeEvent<string[]>) => setBehaviour(e.target.value as string[])}
        />

        {/* Condition MultiSelect */}
        <MultiSelect
          label="Condition"
          value={condition}
          options={conditionOptions}
          onChange={(e: SelectChangeEvent<string[]>) => setCondition(e.target.value as string[])}
        />

        {/* Location Type */}
        <Box sx={{ mb: 3 }}>
          <SingleSelect
            label="Location Type"
            value={locationType}
            options={['Garden', 'Forest', 'Roadside', 'Farmland', 'Wetland', 'Urban']}
            onChange={(e: SelectChangeEvent<string>) => setLocationType(e.target.value)}
          />
        </Box>

        {/* Microhabitat MultiSelect */}
        <MultiSelect
          label="Micro‑Habitat"
          value={microHabitat}
          options={microHabitatOptions}
          onChange={(e: SelectChangeEvent<string[]>) => setMicroHabitat(e.target.value as string[])}
        />

        {/* Time of Day */}
        <Box sx={{ mb: 3 }}>
          <SingleSelect
            label="Time of Day"
            value={timeOfDay}
            options={['Morning', 'Afternoon', 'Evening', 'Night']}
            onChange={(e: SelectChangeEvent<string>) => setTimeOfDay(e.target.value)}
          />
        </Box>

        {/* Weather MultiSelect */}
        <MultiSelect
          label="Weather"
          value={weather}
          options={weatherOptions}
          onChange={(e: SelectChangeEvent<string[]>) => setWeather(e.target.value as string[])}
        />

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

        {/* Add to Database */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={<Switch checked={addToDatabase} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddToDatabase(e.target.checked)} />}
            label="Add to database (unknown species)"
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>Submit Snake</Button>
        </Box>
      </form>
    </Box>
  );
}
