import { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, CircularProgress, Box } from '@mui/material';
import { theme } from './theme';
import AppHeader from './components/AppHeader';
import { useEnsureCurrentWeek } from './hooks/useEnsureCurrentWeek';

type Screen = 'week' | 'foodDb';

function App() {
  const [screen, setScreen] = useState<Screen>('week');
  const { loading } = useEnsureCurrentWeek();

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
          <div>
            {/* Main content will be rendered here based on screen */}
            {screen === 'week' && <div>Weekly View (to be implemented)</div>}
            {screen === 'foodDb' && (
              <div>
                <button onClick={handleBackToWeek}>Back</button>
                Food Database (to be implemented)
              </div>
            )}
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
