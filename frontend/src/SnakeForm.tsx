import React, { useEffect, useState } from 'react';
import { authHeader } from './auth';
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, IconButton, InputLabel, Menu, MenuItem,
  MobileStepper, Select, SelectChangeEvent, Slider, TextField, Typography,
  Switch, FormControlLabel
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

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

export default function SnakeForm({ onLogout }: { onLogout: () => void }) {
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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Settings / menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    setTokenInput(localStorage.getItem('inat_token') ?? '');
  }, []);
  const [identification, setIdentification] = useState<{
    common_name: string; scientific_name: string; score: number; taxon_photo_url: string;
  } | null>(null);
  const [previousSightings, setPreviousSightings] = useState<{
    id: number; created_at: string; location_type: string; snake_name: string;
  }[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setImageFile(selected);
    setImagePreview(selected ? URL.createObjectURL(selected) : null);
  };

  const submitSighting = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const fd = new FormData();
    fd.append('snake_name', snakeName);
    fd.append('species', snakeType);
    if (imageFile) fd.append('image', imageFile);
    fd.append('length_cm', String(length));
    fd.append('thickness', thickness);
    fd.append('pattern', JSON.stringify(pattern));
    fd.append('head_shape', headShape);
    fd.append('eye_type', eyeType);
    fd.append('behaviour', JSON.stringify(behaviour));
    fd.append('condition', JSON.stringify(condition));
    fd.append('num_snakes', String(numSnakes));
    fd.append('confidence', String(confidence));
    fd.append('location_type', locationType);
    fd.append('micro_habitat', JSON.stringify(microHabitat));
    fd.append('time_of_day', timeOfDay);
    fd.append('weather', JSON.stringify(weather));
    fd.append('notes', notes);
    fd.append('add_to_database', String(addToDatabase));
    try {
      const inatToken = localStorage.getItem('inat_token') ?? '';
      const headers: HeadersInit = {
        ...authHeader(),
        ...(inatToken ? { 'X-Inat-Token': inatToken } : {}),
      };
      const res = await fetch('http://localhost:8000/api/sightings/', { method: 'POST', body: fd, headers });
      if (res.status === 401) { onLogout(); return; }
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setIdentification(data.identification ?? null);
      setPreviousSightings(data.previous_sightings ?? []);
      setSubmitted(true);
    } catch {
      setSubmitError('Failed to submit. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (activeStep === stepTitles.length - 1) {
      submitSighting();
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

  const closeMenu = () => setMenuAnchor(null);

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>

      {/* Settings icon + dropdown menu */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <MenuIcon fontSize="small" />
        </IconButton>
      </Box>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={() => { closeMenu(); setSettingsOpen(true); }}>
          iNaturalist Token
        </MenuItem>
        <MenuItem onClick={() => { closeMenu(); setAboutOpen(true); }}>
          About
        </MenuItem>
        <MenuItem onClick={() => { closeMenu(); onLogout(); }}>
          Logout
        </MenuItem>
      </Menu>

      {/* iNaturalist Token dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>iNaturalist Token</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#5a4a2a' }}>
            Paste your API token from{' '}
            <strong>inaturalist.org/users/api_token</strong>{' '}
            (log in first). The token is saved on this device only.
          </Typography>
          <TextField
            label="API Token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={textFieldSx}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            localStorage.setItem('inat_token', tokenInput.trim());
            setSettingsOpen(false);
          }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* About dialog */}
      <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>About SnakeSnap</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>SnakeSnap</strong> helps you record and identify snake sightings across South Africa.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Submit a photo and sighting details and the app will use the{' '}
            <strong>iNaturalist computer vision API</strong> to suggest the species, then show you
            where and when that species has been recorded before.
          </Typography>
          <Typography variant="body2" sx={{ color: '#5a4a2a' }}>
            Species identification powered by iNaturalist · inaturalist.org
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setAboutOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {submitted ? (
        <Box sx={{ py: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Sighting submitted!
          </Typography>

          {identification ? (
            <Box sx={{ mb: 3, p: 2, background: '#fff8ee', borderRadius: 2, border: '1px solid #d4c4a0' }}>
              <Typography variant="subtitle2" sx={{ color: '#5a4a2a', mb: 0.5 }}>
                iNaturalist identification
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {identification.common_name}
              </Typography>
              <Typography sx={{ fontStyle: 'italic', color: '#5a4a2a', mb: 0.5 }}>
                {identification.scientific_name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a7c3f', fontWeight: 600 }}>
                {identification.score}% confidence
              </Typography>
              {identification.taxon_photo_url && (
                <Box sx={{ mt: 1.5 }}>
                  <img
                    src={identification.taxon_photo_url}
                    alt={identification.common_name}
                    style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ mb: 3, p: 2, background: '#fff8ee', borderRadius: 2, border: '1px solid #d4c4a0' }}>
              <Typography sx={{ color: '#5a4a2a' }}>
                {imageFile
                  ? 'No iNaturalist identification available — add your API token to enable this.'
                  : 'No photo uploaded — submit a photo for automatic species identification.'}
              </Typography>
            </Box>
          )}

          {previousSightings.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#5a4a2a', mb: 1 }}>
                This species has been recorded {previousSightings.length} time{previousSightings.length !== 1 ? 's' : ''} before
              </Typography>
              {previousSightings.map((s) => (
                <Box key={s.id} sx={{ py: 0.75, borderBottom: '1px solid #d4c4a0', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    {new Date(s.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5a4a2a', textTransform: 'capitalize' }}>
                    {s.location_type || '—'}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Button variant="contained" fullWidth onClick={() => window.location.reload()}>
            Submit another sighting
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {stepTitles[activeStep]}
          </Typography>

          {steps[activeStep]}

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
          )}

          <MobileStepper
            variant="progress"
            steps={stepTitles.length}
            position="static"
            activeStep={activeStep}
            sx={{ background: 'transparent', px: 0, pt: 1 }}
            nextButton={
              <Button variant="contained" size="small" onClick={handleNext} disabled={submitting}>
                {submitting
                  ? <CircularProgress size={18} sx={{ color: '#fff' }} />
                  : activeStep === stepTitles.length - 1 ? 'Submit' : 'Next'}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0 || submitting}>
                Back
              </Button>
            }
          />
        </>
      )}
    </Box>
  );
}
