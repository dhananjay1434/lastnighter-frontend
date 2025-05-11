import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';

const HomePage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation will be added later
  };

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Slide Extractor
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          Extract slides from educational videos for better studying
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                Video Source
              </Typography>
              <TextField
                fullWidth
                label='YouTube Video URL'
                variant='outlined'
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder='https://www.youtube.com/watch?v=...'
                required
                disabled={loading}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity='error'>
                  {error}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Extract Slides'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default HomePage;
