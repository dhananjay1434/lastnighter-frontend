import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  LinearProgress,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  ErrorOutline as ErrorIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { getJobStatus, getPdfUrl } from '../services/api';
import { JobStatus as JobStatusType } from '../services/api';

const JobStatus = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<JobStatusType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!jobId) {
          setError('Invalid job ID');
          setLoading(false);
          return;
        }

        const jobStatus = await getJobStatus(parseInt(jobId));
        setStatus(jobStatus);

        // If job is still processing, poll for updates
        if (
          jobStatus.status === 'initializing' ||
          jobStatus.status === 'downloading' ||
          jobStatus.status === 'processing'
        ) {
          const timer = setTimeout(() => {
            fetchStatus();
          }, 3000);

          return () => clearTimeout(timer);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [jobId]);

  const handleViewSlides = () => {
    navigate(`/jobs/${jobId}/slides`);
  };

  const handleViewStudyGuide = () => {
    navigate(`/jobs/${jobId}/study-guide`);
  };

  const handleDownloadPdf = () => {
    if (jobId) {
      window.open(getPdfUrl(parseInt(jobId)), '_blank');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Loading job status...
        </Typography>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!status) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Job not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const isCompleted = status.status === 'completed';
  const isFailed = status.status === 'failed';
  const isProcessing =
    status.status === 'initializing' ||
    status.status === 'downloading' ||
    status.status === 'processing';

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Job Status
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Status: {status.status}
          </Typography>
          {isCompleted && <CheckIcon color="success" fontSize="large" />}
          {isFailed && <ErrorIcon color="error" fontSize="large" />}
        </Box>

        {isProcessing && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              {status.message || 'Processing...'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={status.progress}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" align="right" sx={{ mt: 1 }}>
              {status.progress}%
            </Typography>
          </Box>
        )}

        {isFailed && status.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {status.error}
          </Alert>
        )}

        {isCompleted && (
          <>
            <Typography variant="body1" paragraph>
              Successfully extracted {status.slides_count} slides.
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <ImageIcon fontSize="large" color="primary" />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        Slides
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        View extracted slides
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleViewSlides}
                    >
                      View Slides
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

              {status.has_pdf && (
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <PdfIcon fontSize="large" color="primary" />
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          PDF
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Download slides as PDF
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleDownloadPdf}
                      >
                        Download PDF
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )}

              {status.has_study_guide && (
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <DescriptionIcon fontSize="large" color="primary" />
                        <Typography variant="h6" sx={{ mt: 1 }}>
                          Study Guide
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          View generated study guide
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleViewStudyGuide}
                      >
                        View Guide
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Paper>

      <Button variant="outlined" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Container>
  );
};

export default JobStatus;
