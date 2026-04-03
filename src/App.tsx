import { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, CircularProgress, Box } from '@mui/material';
import { theme } from './theme';

import AppHeader from './components/AppHeader';
import { ensureCurrentWeek } from './hooks/ensureCurrentWeek';
import WeekView from './components/WeekView';
import FoodDatabase from './components/FoodDatabase';

type Screen = 'week' | 'foodDb';

function App() {
  const [screen, setScreen] = useState<Screen>('week');
  const [loading, setLoading] = useState(true);
  ensureCurrentWeek(setLoading);

  const handleFoodDbClick = () => setScreen('foodDb');
  const handleBackToWeek = () => setScreen('week');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 0 }}>
        <AppHeader onFoodDbClick={handleFoodDbClick} />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <div style={{ padding: 5 }}>
            {screen === 'week' && <WeekView />}
            {screen === 'foodDb' && <FoodDatabase onBack={handleBackToWeek} />}
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
