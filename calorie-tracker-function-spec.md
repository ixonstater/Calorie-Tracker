# Calorie Tracker — Functionality Specification

## Overview

A React-based weekly calorie and macro tracking application. All data is stored locally in the browser using **Dexie.js** and **dexie-react-hooks**. There is no server or backend. The app tracks food intake across a Monday–Sunday diet week, with support for navigating between weeks and editing goals per week.

---

## Tech Stack

- **React** (functional components, hooks)
- **Dexie.js** — IndexedDB wrapper for local persistence
- **dexie-react-hooks** — `useLiveQuery` for reactive data binding

---

## Database Schema

```js
import Dexie from "dexie";

export const db = new Dexie("CalorieTracker");

db.version(1).stores({
  foods: "++id, name, category",
  weeks: "++id, mondayDate",
  logs: "++id, weekId, date, foodId",
});
```

### Table: `foods`

Stores the user's personal food database.

| Field       | Type   | Description                               |
| ----------- | ------ | ----------------------------------------- |
| id          | number | Auto-incremented primary key              |
| name        | string | Food name (e.g., "Chicken Breast")        |
| category    | string | Optional label (e.g., "Protein", "Snack") |
| calories    | number | Calories per serving                      |
| protein     | number | Grams of protein per serving              |
| carbs       | number | Grams of carbs per serving                |
| fat         | number | Grams of fat per serving                  |
| servingSize | number | Numeric quantity of one serving           |
| servingUnit | string | Unit label (e.g., "g", "oz", "cup")       |

### Table: `weeks`

One record per diet week. A week always starts on Monday.

| Field       | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| id          | number | Auto-incremented primary key                       |
| mondayDate  | string | ISO date string of the Monday (e.g., "2026-03-30") |
| calorieGoal | number | Weekly calorie target                              |
| proteinGoal | number | Weekly protein target in grams                     |
| carbGoal    | number | Weekly carb target in grams                        |
| fatGoal     | number | Weekly fat target in grams                         |

### Table: `logs`

One record per food entry logged on a given day.

| Field     | Type   | Description                                                     |
| --------- | ------ | --------------------------------------------------------------- |
| id        | number | Auto-incremented primary key                                    |
| weekId    | number | Foreign key → `weeks.id`                                        |
| date      | string | ISO date string of the specific day (e.g., "2026-04-01")        |
| foodId    | number | Foreign key → `foods.id`                                        |
| servings  | number | Number of servings consumed (supports decimals)                 |
| timestamp | number | Unix timestamp (milliseconds) for ordering entries within a day |

---

## Week Logic

### Definition

A diet week runs **Monday through Sunday**. Each week is identified by the ISO date string of its Monday.

### Calculating the Current Week's Monday

```js
function getMondayDate(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
}
```

### Auto-Creating the Current Week on App Load

On startup, check if a week record exists for the current Monday. If not, create one:

1. Query `weeks` for the most recent record (order by `mondayDate` descending, take 1).
2. If a prior week exists, copy its `calorieGoal`, `proteinGoal`, `carbGoal`, `fatGoal`.
3. If no prior week exists, use these static defaults:
   - `calorieGoal`: 14000 (2000/day)
   - `proteinGoal`: 1050 (150g/day)
   - `carbGoal`: 1400 (200g/day)
   - `fatGoal`: 455 (65g/day)
4. Insert the new week record.

### Week Navigation

- The app always displays one week at a time.
- The user can navigate to previous or next weeks using back/forward controls.
- All weeks (past and present) are fully editable — there is no read-only mode.
- Navigating to a future week that does not yet exist should **not** auto-create it; only the current real-world week is auto-created on load.

---

## Features

### 1. Weekly View

The primary screen. Displays the selected diet week (Mon–Sun).

- Shows the week date range (e.g., "Mar 30 – Apr 5, 2026")
- Displays each of the 7 days as a list or tab strip
- Tapping/clicking a day opens the Daily Log for that day
- Shows a weekly summary: total calories and macros logged vs. goal
- Week navigation controls (previous / next week)

### 2. Weekly Goals Editor

Accessible from the Weekly View (e.g., an edit button near the week header).

- Editable fields: `calorieGoal`, `proteinGoal`, `carbGoal`, `fatGoal`
- Changes are saved immediately to the `weeks` record for that week
- Goals are per-week and do not affect other weeks

### 3. Daily Log

Shows all food entries logged for a specific day within the selected week.

- Displays entries in timestamp order (oldest first)
- Each entry shows: food name, servings, and calculated calories/macros (servings × per-serving values)
- Shows a daily total: sum of calories, protein, carbs, fat for that day
- User can **delete** any log entry

#### Adding a Log Entry

1. User opens an "Add Food" panel or modal
2. User searches the food database by name
3. User selects a food and enters the number of servings (decimal supported, e.g., 1.5)
4. Entry is saved to `logs` with the current `weekId`, selected `date`, chosen `foodId`, servings, and current timestamp

### 4. Food Database

A separate screen for managing the user's personal food library.

- Lists all foods, searchable/filterable by name
- User can **add** a new food (all fields in the `foods` schema)
- User can **edit** an existing food
- User can **delete** a food
  - **Important:** Deleting a food does NOT delete associated log entries. Log entries referencing a deleted food should display a fallback (e.g., "[Deleted Food]") rather than crashing.

### 5. Macro Calculations

All macro values displayed in the app are calculated at render time — they are not stored in `logs`. The formula is:

```
displayed calories = logs.servings × foods.calories
displayed protein  = logs.servings × foods.protein
displayed carbs    = logs.servings × foods.carbs
displayed fat      = logs.servings × foods.fat
```

Daily totals = sum of all log entry values for that day.
Weekly totals = sum of all log entry values across all 7 days.

---

## Data Access Patterns (using dexie-react-hooks)

Use `useLiveQuery` for all data that needs to stay in sync with the UI:

```js
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";

// Get week record for a given Monday date string
const week = useLiveQuery(() => db.weeks.where("mondayDate").equals(mondayDate).first(), [mondayDate]);

// Get all log entries for a specific day within a week
const logs = useLiveQuery(() => db.logs.where({ weekId: week?.id, date: selectedDate }).toArray(), [week?.id, selectedDate]);

// Get all foods for search
const foods = useLiveQuery(() => db.foods.toArray());
```

---

## Edge Cases & Rules

- **Deleted foods in logs:** When rendering a log entry, look up the food from the in-memory foods list. If not found, display "[Deleted Food]" for the name and treat all macro values as 0 or show "—".
- **Servings input:** Must be a positive number greater than 0. Support up to 2 decimal places.
- **Goals input:** All goal fields must be positive integers. Validate before saving.
- **Week navigation:** Do not allow navigating forward past the current real-world week. The current week is the upper bound.
- **mondayDate uniqueness:** Enforce that only one `weeks` record exists per `mondayDate`. Check before inserting.
- **Empty days:** A day with no log entries simply shows 0 totals. No special state needed.

---

## File/Component Structure (Suggested)

```
src/
  db.js                  # Dexie database definition
  App.jsx                # Root component, week auto-creation on mount
  components/
    WeekView.jsx         # Weekly overview, day selector, nav controls
    GoalsEditor.jsx      # Edit weekly calorie/macro goals
    DailyLog.jsx         # Log entries for a single day + daily totals
    AddFoodEntry.jsx     # Search foods, enter servings, save log entry
    FoodDatabase.jsx     # List, search, add, edit, delete foods
    FoodForm.jsx         # Reusable form for adding/editing a food
```

---

## Static Defaults

| Goal        | Daily | Weekly (×7) |
| ----------- | ----- | ----------- |
| Calories    | 2,000 | 14,000      |
| Protein (g) | 150   | 1,050       |
| Carbs (g)   | 200   | 1,400       |
| Fat (g)     | 65    | 455         |
