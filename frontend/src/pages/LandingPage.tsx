import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  EmojiEvents,
  Speed,
  TrendingUp,
  Psychology,
  AutoFixHigh,
  Security,
} from '@mui/icons-material';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Psychology />,
      title: 'Interactive Challenges',
      description: 'Master prompt engineering through real-world scenarios and hands-on practice.',
    },
    {
      icon: <AutoFixHigh />,
      title: 'AI-Powered Feedback',
      description: 'Get instant, detailed feedback on your prompts with personalized improvement suggestions.',
    },
    {
      icon: <EmojiEvents />,
      title: 'Gamified Learning',
      description: 'Earn points, unlock badges, and climb the leaderboard as you progress.',
    },
    {
      icon: <TrendingUp />,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and version control.',
    },
    {
      icon: <Speed />,
      title: 'Real-time Evaluation',
      description: 'Test your prompts instantly and see how they perform with GPT-4.',
    },
    {
      icon: <Security />,
      title: 'Hallucination Detection',
      description: 'Learn to identify and prevent AI hallucinations with guided exercises.',
    },
  ];

  const stats = [
    { number: '10+', label: 'Challenges' },
    { number: '6', label: 'Badge Types' },
    { number: '5', label: 'Skill Levels' },
    { number: '100%', label: 'AI-Powered' },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🚀 Promptifyr
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/auth')}
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Level‑up your{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  prompting skills
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  lineHeight: 1.4,
                }}
              >
                Master the art of AI prompt engineering through gamified challenges,
                real-time feedback, and hands-on practice with GPT-4.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/auth')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                  }}
                >
                  Start Learning Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="inherit"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                  }}
                >
                  View Demo
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 2, color: 'white' }}>
                    🎯
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    Interactive Challenges
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Real-world scenarios to master prompt engineering
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
            }}
          >
            Why Choose Promptifyr?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Our comprehensive platform combines cutting-edge AI technology with proven
            educational methods to accelerate your learning journey.
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: 'primary.light',
                          color: 'white',
                          mr: 2,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Ready to Master Prompt Engineering?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              Join thousands of learners improving their AI interaction skills.
              Start your journey today — it's completely free!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/auth')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 600,
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              🚀 Promptifyr
            </Typography>
            <Typography variant="body2" color="grey.400">
              © 2024 Promptifyr. Level‑up your prompting skills.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 