import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import { theme } from "./theme";

import WeekView from "./components/WeekView";
import AppHeader from "./components/AppHeader";
import { db } from "./db";
import { getCurrentMondayDate } from "./utils/date";

(async () => {
  const mondayDate = getCurrentMondayDate();
  const query = db.calorieLogs.where("mondayDate").notEqual(mondayDate);
  await query.delete();
})();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader></AppHeader>
      <Container maxWidth="sm" sx={{ minHeight: "100vh", bgcolor: "background.default", p: 0 }}>
        <WeekView />
      </Container>
    </ThemeProvider>
  );
}

export default App;
