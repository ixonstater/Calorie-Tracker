# Calorie Tracker — UI Design Spec

## Design Direction

**Aesthetic:** Clean, utilitarian health-tech — think the precision of a fitness wearable app paired with the density of a spreadsheet tool. The interface prioritizes clarity and quick data entry over decoration.

**Tone:** Dark-mode primary, with a muted charcoal base and a single high-energy accent using MUI's built-in `orange` preset (`orange[500]` = `#FF9800`). Typography is mono for numbers, sans-serif for labels.

**MUI Theme:** Custom `createTheme` with `mode: 'dark'`, overriding the default palette to use near-black backgrounds, and setting the primary accent to MUI's orange preset via `import { orange } from '@mui/material/colors'`. All components use `size="small"` or `size="medium"` for density.

---

## MUI Theme Configuration

```js
import { createTheme } from '@mui/material/styles';
import { orange, amber } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0F1117',
      paper:   '#181C24',
    },
    primary: {
      main:          orange[500],   // '#FF9800'
      light:         orange[300],   // '#FFB74D'
      dark:          orange[700],   // '#F57C00'
      contrastText:  '#0F1117',
    },
    secondary: {
      main: amber[400],             // '#FFCA28'
    },
    text: {
      primary:   '#F1F5F9',
      secondary: '#94A3B8',
    },
    divider: '#2D3340',
    error: {
      main: '#F87171',
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h5:  { fontWeight: 700, letterSpacing: '-0.02em' },
    h6:  { fontWeight: 600, letterSpacing: '-0.01em' },
    body2: { color: '#94A3B8' },
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
        root: { border: '1px solid #2D3340' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        containedPrimary: { color: '#0F1117', fontWeight: 700 }, // dark text on orange background
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6, backgroundColor: '#2D3340' },
        bar:  { borderRadius: 4 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minWidth: 64,
        },
      },
    },
  },
});
```

---

## Layout Shell

```
┌──────────────────────────────────────────────────────┐
│  AppBar (sticky, elevation 0, border-bottom)          │
│  Left: App logo/name  Right: "Food DB" icon button    │
├──────────────────────────────────────────────────────┤
│                                                        │
│  [ Main content area — scrollable ]                   │
│                                                        │
└──────────────────────────────────────────────────────┘
```

### AppBar

- **Component:** `<AppBar position="sticky">` with `sx={{ borderBottom: '1px solid divider', bgcolor: 'background.paper' }}`
- **Left:** `<Typography variant="h6">` showing the app name in primary color accent (e.g. a small orange dot before "CalTrack")
- **Right:** `<IconButton>` using `<StorageIcon />` (or `<MenuBookIcon />`) to navigate to the Food Database screen
- No drawer/sidebar. Navigation is screen-level, toggled by state in `App.jsx`.

---

## Screen 1 — Weekly View (`WeekView.jsx`)

### Week Header Bar

```
  ← [Icon]   Mar 30 – Apr 5, 2026   [Icon] →   [Edit Goals]
```

- **Layout:** `<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>`
- Prev/Next week: `<IconButton>` with `<ChevronLeftIcon />` / `<ChevronRightIcon />`
- Week range: `<Typography variant="subtitle1" fontWeight={600}>`
- Edit Goals: `<Button variant="outlined" size="small" startIcon={<EditIcon />}>Goals</Button>`

### Weekly Summary Card

A `<Paper>` card beneath the header showing the weekly totals vs. goals.

```
┌─────────────────────────────────────────────────────┐
│  WEEKLY TOTAL                              9,240 / 14,000 kcal  │
│  ████████████████░░░░░░░░░░  66%                    │
│                                                       │
│  Protein  Carbs  Fat                                  │
│  620/1050g  890/1400g  280/455g                      │
│  ████░░░░  ███████░░  ████░░░                        │
└─────────────────────────────────────────────────────┘
```

- Calories row: `<Typography variant="body2" color="text.secondary">WEEKLY TOTAL</Typography>` + `<Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }}>` for the numbers
- Progress bar: `<LinearProgress variant="determinate" value={pct} color="primary" />`
- Macros row: `<Grid container spacing={2}>` with 3 `<Grid item xs={4}>` columns, each containing label, `X / Yg`, and a `<LinearProgress>`
- Macro progress bar colors:
  - Protein → custom `sx` teal `#2DD4BF`
  - Carbs → `color="secondary"` (amber `#FFCA28`)
  - Fat → custom `sx` sky blue `#38BDF8`

### Day Selector

A horizontal tab strip for Mon–Sun.

```
  Mon   Tue   Wed   Thu   Fri   Sat   Sun
   4/1   4/2   4/3 ●  4/4   4/5   4/6   4/7
```

- **Component:** `<Tabs value={selectedDayIndex} onChange={...} variant="scrollable" scrollButtons="auto">`
- Each `<Tab>` shows: day abbreviation on top, date number below
- Today's date tab gets `sx={{ color: 'primary.main' }}` and a small dot indicator (via `::after` pseudo or an `<Box>` absolutely positioned)
- Selected tab indicator uses `primary.main`

### Daily Log Panel

Rendered below the day tabs. This is the `<DailyLog />` component embedded inline on the Weekly View.

---

## Screen 2 — Daily Log (`DailyLog.jsx`)

### Daily Totals Row

```
  Today: 1,320 kcal  |  P: 88g  C: 140g  F: 42g
```

- `<Paper sx={{ p: 1.5, mb: 2, display: 'flex', gap: 3, alignItems: 'center' }}>`
- Calories: `<Typography fontWeight={700} sx={{ fontFamily: 'monospace' }}>`
- Macros: `<Chip label="P: 88g" size="small" sx={{ bgcolor: '#134E4A', color: '#2DD4BF' }} />` etc., color-coded to match macro colors

### Log Entry List

- **Component:** `<List disablePadding>`
- Each entry: `<ListItem secondaryAction={<IconButton edge="end"><DeleteIcon fontSize="small" /></IconButton>}>`
  - Primary text: food name (bold). For deleted foods: `"[Deleted Food]"` in `text.secondary` color
  - Secondary text: `1.5 servings · 360 kcal · P 27g · C 12g · F 18g` — all in `text.secondary`
  - A subtle `<Divider />` between entries

### Add Food Entry Button

- Fixed at the bottom of the daily log panel
- `<Button variant="contained" color="primary" fullWidth startIcon={<AddIcon />} sx={{ mt: 2 }}>Log Food</Button>`
- Clicking opens the Add Food Entry drawer

---

## Dialog/Drawer: Add Food Entry (`AddFoodEntry.jsx`)

Rendered as a bottom-anchored `<Drawer anchor="bottom">` (mobile-friendly) with a max-height of 80vh and a rounded top-edge (`borderRadius: '16px 16px 0 0'`).

### Contents

1. **Drag handle** — `<Box sx={{ width: 40, height: 4, bgcolor: 'divider', borderRadius: 2, mx: 'auto', mt: 1, mb: 2 }} />`
2. **Title:** `<Typography variant="h6">Log Food</Typography>`
3. **Search field:** `<TextField fullWidth size="small" placeholder="Search foods…" InputProps={{ startAdornment: <SearchIcon /> }} />`
4. **Results list:** `<List>` — each `<ListItemButton>` shows food name + calories per serving as a `<ListItemSecondaryAction>` chip
5. **Selected food section** (shown after selecting):
   - Food name as `<Typography variant="subtitle1" fontWeight={600}>`
   - Serving info: `"1 serving = 240 kcal · P 20g · C 28g · F 5g"` in `text.secondary`
   - Servings input: `<TextField type="number" size="small" label="Servings" inputProps={{ step: 0.25, min: 0.25 }} sx={{ width: 120 }} />`
   - Live preview: `<Chip label="≈ 360 kcal" color="primary" size="small" />`
   - `<Button variant="contained" fullWidth>Add to Log</Button>`

---

## Screen 3 — Weekly Goals Editor (`GoalsEditor.jsx`)

Rendered as a `<Dialog fullWidth maxWidth="xs">`.

### Contents

- **Title:** `<DialogTitle>Edit Week Goals</DialogTitle>`
- **Body:** `<DialogContent>` with a `<Stack spacing={2}>`
  - 4 `<TextField>` fields, each `type="number"`, `size="small"`, with labels:
    - Calories (kcal/week)
    - Protein (g/week)
    - Carbs (g/week)
    - Fat (g/week)
  - Each field shows a helper text with the per-day equivalent: `"= 2,000 kcal/day"` (computed live)
- **Actions:** `<DialogActions>` — `<Button onClick={onClose}>Cancel</Button>` + `<Button variant="contained" onClick={handleSave}>Save</Button>`

---

## Screen 4 — Food Database (`FoodDatabase.jsx`)

Full-screen view toggled from the AppBar icon.

### Header

- Back button: `<IconButton onClick={goBack}><ArrowBackIcon /></IconButton>` + `<Typography variant="h6">Food Database</Typography>`
- Add button: `<Button variant="contained" size="small" startIcon={<AddIcon />}>New Food</Button>`

### Search / Filter Bar

- `<TextField fullWidth size="small" placeholder="Search by name…" InputProps={{ startAdornment: <SearchIcon /> }} sx={{ my: 2 }} />`

### Food List

- `<List>` — each `<ListItem>` shows:
  - **Primary:** food name in bold + category `<Chip label="Protein" size="small" sx={{ ml: 1 }} />`
  - **Secondary:** `240 kcal · P 20g · C 28g · F 5g · per 100g`
  - **Actions (right):** `<IconButton><EditIcon fontSize="small" /></IconButton>` + `<IconButton color="error"><DeleteIcon fontSize="small" /></IconButton>`
- Empty state: `<Box textAlign="center" py={6}><Typography color="text.secondary">No foods yet. Add your first food to get started.</Typography></Box>`

---

## Dialog: Add / Edit Food (`FoodForm.jsx`)

Rendered as `<Dialog fullWidth maxWidth="sm">`.

### Layout

`<DialogContent>` contains a `<Grid container spacing={2}>`:

| Row | Fields |
|-----|--------|
| 1 | Name (xs=8) · Category (xs=4) |
| 2 | Calories (xs=3) · Protein (xs=3) · Carbs (xs=3) · Fat (xs=3) |
| 3 | Serving Size (xs=4) · Serving Unit (xs=4) |

- All fields: `<TextField size="small" fullWidth />`
- Number fields: `type="number"`, `inputProps={{ min: 0 }}`
- Category: `<TextField select>` with a few `<MenuItem>` presets (Protein, Carbs, Fat, Dairy, Vegetable, Fruit, Snack, Other) plus free-text fallback
- Serving Unit: `<TextField select>` with options: g, oz, cup, ml, tbsp, tsp, piece

### Actions

`<DialogActions>` — Cancel + Save (contained primary)

---

## Macro Color Reference

| Macro    | Color Token      | Hex       | Use for progress bars, chips, labels  |
|----------|------------------|-----------|---------------------------------------|
| Calories | `primary.main`   | `#FF9800` | Main accent (MUI `orange[500]`)       |
| Protein  | —                | `#2DD4BF` | Teal (custom sx)                      |
| Carbs    | `secondary.main` | `#FFCA28` | Amber (MUI `amber[400]`)              |
| Fat      | —                | `#38BDF8` | Sky blue (custom sx)                  |

---

## Component Checklist (MUI Components Used)

| Component         | Usage                                              |
|-------------------|----------------------------------------------------|
| `AppBar`          | Top navigation bar                                 |
| `Toolbar`         | AppBar inner layout                                |
| `IconButton`      | Nav controls, delete, edit, close, back            |
| `Button`          | Primary actions, goals, add food                   |
| `Typography`      | All text; monospace variant for numbers            |
| `Paper`           | Cards (weekly summary, daily totals)               |
| `LinearProgress`  | Macro and calorie progress bars                    |
| `Tabs` / `Tab`    | Day selector strip                                 |
| `List` / `ListItem` / `ListItemButton` | Log entries, food search results, food DB |
| `Divider`         | Between list items                                 |
| `TextField`       | Search, goals, food form, servings input           |
| `Chip`            | Macro badges, category labels, calorie preview     |
| `Dialog` / `DialogTitle` / `DialogContent` / `DialogActions` | Goals editor, food form |
| `Drawer`          | Add food entry (bottom sheet)                      |
| `Grid`            | Macro columns, food form field layout              |
| `Stack`           | Flex layout for rows and vertical stacks           |
| `Box`             | Layout primitives, drag handle, empty states       |

---

## Responsive Behavior

- Target: primarily mobile (375–430px wide) with desktop support
- The app is constrained to `maxWidth: 480px` centered on desktop via `<Container maxWidth="sm">`
- No sidebar or multi-column layout — single-column throughout
- Bottom `<Drawer>` for Add Food suits mobile thumb reach
- `<Tabs variant="scrollable">` handles narrow day strips gracefully

---

## Accessibility Notes

- All `<IconButton>` elements include `aria-label`
- `<LinearProgress>` includes `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `<TextField>` fields use `label` prop (not just `placeholder`) for screen reader support
- Color is never the sole indicator of meaning — macro labels always include text
- Focus ring preserved (MUI default); do not override `outline: none` globally
