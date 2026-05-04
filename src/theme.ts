import { createTheme } from "@mui/material/styles";
import { orange, amber } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0F1117",
      paper: "#181C24",
    },
    primary: {
      main: orange[500], // '#FF9800'
      light: orange[300], // '#FFB74D'
      dark: orange[700], // '#F57C00'
      contrastText: "#0F1117",
    },
    secondary: {
      main: amber[400], // '#FFCA28'
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#94A3B8",
    },
    divider: "#2D3340",
    error: {
      main: "#F87171",
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h5: { fontWeight: 700, letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    body2: { color: "#94A3B8" },
    // Numbers rendered in mono
    // Apply via sx={{ fontFamily: 'monospace' }} on Typography nodes showing counts/macros
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: "1px solid #2D3340" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        containedPrimary: { color: "#0F1117", fontWeight: 700 }, // dark text on orange background
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6, backgroundColor: "#2D3340" },
        bar: { borderRadius: 4 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          minWidth: 64,
        },
      },
    },
  },
});
