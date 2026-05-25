import React, { useState } from 'react';
import {
  Box, Button, FormControl, InputLabel, MenuItem, MobileStepper, Select,
  SelectChangeEvent, Slider, TextField, Typography, Switch, FormControlLabel
} from '@mui/material';

const snakeTypeOptions = [
  "Puff Adder", "Black Mamba", "Green Mamba", "Cape Cobra", "Mozambique Spitting Cobra",
  "Snouted Cobra", "Forest Cobra", "Rinkhals", "Boomslang", "Vine Snake",
  "Gaboon Adder", "Berg Adder", "Horned Adder", "Night Adder", "Stiletto Snake",
  "African Rock Python", "Brown House Snake", "Mole Snake", "African Egg-eater",
  "Spotted Bush Snake", "Common Slug-eater",
];
const patternOptions = ["Stripes", "Bands", "Spots", "Solid", "Diamond", "Speckled"];
const behaviourOptions = ["Calm", "Hiding", "Climbing", "Swimming", "Defensive", "Striking", "Fleeing"];
const conditionOptions = ["Healthy", "Shedding", "Injured", "Parasites"];
const microHabitatOptions = ["Grass", "Under rock", "Leaf litter", "Tree", "Water edge", "Path", "Wall"];
const weatherOptions = ["Sunny", "Cloudy", "Rainy", "Windy", "Hot", "Cold"];

const stepTitles = ['Photo & ID', 'Appearance', 'Behaviour', 'Location', 'Notes'];

type MultiSelectProps = {
  label: string;
  value: string[];
  options: string[];
  onChange: (e: SelectChangeEvent<string[]>) => void;
};

const dropdownSx = { mb: 3 };

const fg = '#2c2008';
const bg = '#fff8ee';

const selectSx = {
  color: fg,
  background: bg,
  borderRadius: 1,
};

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: fg,
    background: bg,
    borderRadius: 1,
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)', borderWidth: 1 },
  },
  '& .MuiInputLabel-root': { color: fg, background: bg, px: 0.5 },
  '& .MuiInputLabel-root.Mui-focused': { color: fg },
};

const menuProps = {
  sx: { '& .MuiPaper-root': { background: bg, color: fg } },
};

function SingleSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (e: SelectChangeEvent<string>) => void }) {
  return (
    <FormControl fullWidth sx={dropdownSx}>
      <InputLabel sx={{ color: fg, background: bg, px: 0.5 }}>{label}</InputLabel>
      <Select value={value} onChange={onChange} label={label} sx={selectSx} MenuProps={menuProps}>
        {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

function MultiSelect({ label, value, options, onChange }: MultiSelectProps) {
  return (
    <FormControl fullWidth sx={dropdownSx}>
      <InputLabel sx={{ color: fg, background: bg, px: 0.5 }}>{label}</InputLabel>
      <Select multiple value={value} onChange={onChange} label={label} sx={selectSx}
        renderValue={(selected) => (selected as string[]).join(', ')} MenuProps={menuProps}>
        {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

export default function SnakeForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [snakeName, setSnakeName] = useState('');
  const [snakeType, setSnakeType] = useState('');
  const [length, setLength] = useState(50);
  const [thickness, setThickness] = useState('');
  const [pattern, setPattern] = useState<string[]>([]);
  const [headShape, setHeadShape] = useState('');
  const [eyeType, setEyeType] = useState('');
  const [behaviour, setBehaviour] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const [locationType, setLocationType] = useState('');
  const [microHabitat, setMicroHabitat] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState('');
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
    setImagePreview(selected ? URL.createObjectURL(selected) : null);
  };

  const handleNext = () => {
    if (activeStep === stepTitles.length - 1) {
      alert('Form submitted!');
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const steps: React.ReactNode[] = [
    // Step 0 — Photo & ID
    <Box key={0}>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Snake Name (optional)"
          value={snakeName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSnakeName(e.target.value)}
          fullWidth
          sx={textFieldSx}
        />
      </Box>
      <SingleSelect
        label="Species (if identified)"
        value={snakeType}
        options={snakeTypeOptions}
        onChange={(e: SelectChangeEvent<string>) => setSnakeType(e.target.value)}
      />
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          {imageFile ? 'Change Photo' : 'Upload Photo'}
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>
        {imagePreview && (
          <Box>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
          </Box>
        )}
      </Box>
    </Box>,

    // Step 1 — Appearance
    <Box key={1}>
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Estimated Length: {length} cm</Typography>
        <Slider value={length} min={10} max={300}
          onChange={(_e: Event, v: number | number[]) => setLength(v as number)}
          valueLabelDisplay="auto" />
      </Box>
      <SingleSelect label="Body Thickness" value={thickness}
        options={['Thin', 'Medium', 'Thick']}
        onChange={(e: SelectChangeEvent<string>) => setThickness(e.target.value)} />
      <MultiSelect label="Colour Pattern" value={pattern} options={patternOptions}
        onChange={(e: SelectChangeEvent<string[]>) => setPattern(e.target.value as string[])} />
      <SingleSelect label="Head Shape" value={headShape}
        options={['Rounded', 'Triangular', 'Narrow']}
        onChange={(e: SelectChangeEvent<string>) => setHeadShape(e.target.value)} />
      <SingleSelect label="Eye Type" value={eyeType}
        options={['Round pupil', 'Vertical pupil', 'Not visible']}
        onChange={(e: SelectChangeEvent<string>) => setEyeType(e.target.value)} />
    </Box>,

    // Step 2 — Behaviour
    <Box key={2}>
      <MultiSelect label="Behaviour" value={behaviour} options={behaviourOptions}
        onChange={(e: SelectChangeEvent<string[]>) => setBehaviour(e.target.value as string[])} />
      <MultiSelect label="Condition" value={condition} options={conditionOptions}
        onChange={(e: SelectChangeEvent<string[]>) => setCondition(e.target.value as string[])} />
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Number of Snakes: {numSnakes}</Typography>
        <Slider value={numSnakes} min={1} max={10} step={1}
          onChange={(_e: Event, v: number | number[]) => setNumSnakes(v as number)}
          valueLabelDisplay="auto" />
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Confidence: {confidence}%</Typography>
        <Slider value={confidence} min={0} max={100}
          onChange={(_e: Event, v: number | number[]) => setConfidence(v as number)}
          valueLabelDisplay="auto" />
      </Box>
    </Box>,

    // Step 3 — Location
    <Box key={3}>
      <SingleSelect label="Location Type" value={locationType}
        options={['Garden', 'Forest', 'Roadside', 'Farmland', 'Wetland', 'Urban']}
        onChange={(e: SelectChangeEvent<string>) => setLocationType(e.target.value)} />
      <MultiSelect label="Micro‑Habitat" value={microHabitat} options={microHabitatOptions}
        onChange={(e: SelectChangeEvent<string[]>) => setMicroHabitat(e.target.value as string[])} />
      <SingleSelect label="Time of Day" value={timeOfDay}
        options={['Morning', 'Afternoon', 'Evening', 'Night']}
        onChange={(e: SelectChangeEvent<string>) => setTimeOfDay(e.target.value)} />
      <MultiSelect label="Weather" value={weather} options={weatherOptions}
        onChange={(e: SelectChangeEvent<string[]>) => setWeather(e.target.value as string[])} />
    </Box>,

    // Step 4 — Notes
    <Box key={4}>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Comments (optional)"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
          fullWidth multiline minRows={3}
          sx={textFieldSx}
        />
      </Box>
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={<Switch checked={addToDatabase}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddToDatabase(e.target.checked)} />}
          label="Add to database (unknown species)"
        />
      </Box>
    </Box>,
  ];

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {stepTitles[activeStep]}
      </Typography>

      {steps[activeStep]}

      <MobileStepper
        variant="progress"
        steps={stepTitles.length}
        position="static"
        activeStep={activeStep}
        sx={{ background: 'transparent', px: 0, pt: 1 }}
        nextButton={
          <Button variant="contained" size="small" onClick={handleNext}>
            {activeStep === stepTitles.length - 1 ? 'Submit' : 'Next'}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
        }
      />
    </Box>
  );
}
