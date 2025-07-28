import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  PlayArrow,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for initial render
  const recentChallenges = [
    { id: '1', title: '🤖 News Article Summarizer', difficulty: 'beginner', score: 85, completed: true },
    { id: '2', title: '🧪 Python Function Generator', difficulty: 'beginner', score: 72, completed: true },
    { id: '3', title: '🌱 Simple Science Explainer', difficulty: 'beginner', score: 0, completed: false },
  ];

  const stats = [
    { label: 'Challenges Completed', value: user?.challengesCompleted?.length || 0, icon: <EmojiEvents /> },
    { label: 'Total Points', value: user?.points || 0, icon: <Star /> },
    { label: 'Current Level', value: user?.currentLevel || 1, icon: <TrendingUp /> },
    { label: 'Badges Earned', value: user?.badges?.length || 0, icon: <EmojiEvents /> },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to level up your prompting skills? Let's continue your journey.
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Your Progress
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Level {user?.currentLevel || 1}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.pointsToNextLevel || 0} points to next level
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={75} // This would be calculated based on progress
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {user?.points || 0} total points earned
          </Typography>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    color: 'white',
                    mb: 1,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Challenges */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Challenges
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/challenges')}
                  size="small"
                >
                  View All
                </Button>
              </Box>
              <Stack spacing={2}>
                {recentChallenges.map((challenge) => (
                  <Box
                    key={challenge.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'grey.50',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => navigate(`/challenges/${challenge.id}`)}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {challenge.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={challenge.difficulty}
                          size="small"
                          color={getDifficultyColor(challenge.difficulty) as any}
                        />
                        {challenge.completed && (
                          <Chip
                            label={`${challenge.score}%`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayArrow />}
                    >
                      {challenge.completed ? 'Retry' : 'Start'}
                    </Button>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/challenges')}
                  sx={{ py: 1.5 }}
                >
                  Browse Challenges
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/leaderboard')}
                  sx={{ py: 1.5 }}
                >
                  View Leaderboard
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/profile')}
                  sx={{ py: 1.5 }}
                >
                  View Profile
                </Button>
              </Stack>
              
              {/* Achievement Section */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent Badges
                </Typography>
                {user?.badges && user.badges.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {user.badges.slice(0, 3).map((badge, index) => (
                      <Avatar
                        key={index}
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'primary.main',
                          fontSize: '1.5rem',
                        }}
                      >
                        🏅
                      </Avatar>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Complete challenges to earn badges!
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 