import React from "react";
import { Box, Paper, Typography, Chip, List, ListItem, ListItemText, IconButton, Divider, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddFoodEntry from "./AddFoodEntry";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

interface DailyLogProps {
  weekId: number | undefined;
  date: string;
}

const macroColors = {
  protein: { bgcolor: "#134E4A", color: "#2DD4BF" },
  carbs: { bgcolor: "#F59E42", color: "#FFCA28" },
  fat: { bgcolor: "#0E3A5E", color: "#38BDF8" },
};

const DailyLog: React.FC<DailyLogProps> = ({ weekId, date }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  // Get all foods and logs for this day
  const foods = useLiveQuery(() => db.foods.toArray(), []);
  const logs = useLiveQuery(() => db.logs.where({ weekId, date }).sortBy("timestamp"), [weekId, date]);

  // Calculate totals
  let total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  if (logs && foods) {
    for (const log of logs) {
      const food = foods.find((f) => f.id === log.foodId);
      if (food) {
        total.calories += log.servings * food.calories;
        total.protein += log.servings * food.protein;
        total.carbs += log.servings * food.carbs;
        total.fat += log.servings * food.fat;
      }
    }
  }

  return (
    <Box>
      {/* Daily Totals Row */}
      <Paper sx={{ p: 1.5, mb: 2, display: "flex", gap: 3, alignItems: "center" }}>
        <Typography fontWeight={700} sx={{ fontFamily: "monospace" }}>
          {`Total: ${Math.round(total.calories)} kcal`}
        </Typography>
        <Chip label={`P: ${Math.round(total.protein)}g`} size="small" sx={macroColors.protein} />
        <Chip label={`C: ${Math.round(total.carbs)}g`} size="small" sx={macroColors.carbs} />
        <Chip label={`F: ${Math.round(total.fat)}g`} size="small" sx={macroColors.fat} />
      </Paper>

      {/* Log Entry List */}
      <List disablePadding>
        {logs && logs.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">No entries logged.</Typography>
          </Box>
        )}
        {logs &&
          foods &&
          logs.map((log) => {
            const food = foods.find((f) => f.id === log.foodId);
            const deleted = !food;
            const handleDelete = async () => {
              await db.logs.delete(log.id!);
            };
            return (
              <React.Fragment key={log.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="Delete entry" onClick={handleDelete}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight={deleted ? 400 : 600} color={deleted ? "text.secondary" : undefined}>
                        {deleted ? "[Deleted Food]" : food?.name}
                      </Typography>
                    }
                    secondary={
                      deleted ? (
                        <Typography color="text.secondary">—</Typography>
                      ) : (
                        <Typography color="text.secondary">{`${log.servings} serving${log.servings !== 1 ? "s" : ""} · ${Math.round(log.servings * food!.calories)} kcal · P ${Math.round(log.servings * food!.protein)}g · C ${Math.round(log.servings * food!.carbs)}g · F ${Math.round(log.servings * food!.fat)}g`}</Typography>
                      )
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            );
          })}
      </List>

      {/* Add Food Entry Button */}
      <Box sx={{ position: "sticky", display: "flex", flexDirection: "column", alignItems: "center", bottom: 0, mt: 2 }}>
        <Button variant="contained" color="primary" sx={{ width: "100%", maxWidth: 270, textAlign: "left", marginBottom: 2 }} startIcon={<AddIcon />} onClick={() => setDrawerOpen(true)}>
          Log Food
        </Button>
        <Button variant="contained" color="primary" sx={{ width: "100%", maxWidth: 270, textAlign: "left" }} startIcon={<AddIcon />}>
          Log Un-Indexed Food
        </Button>
      </Box>
      <AddFoodEntry open={drawerOpen} onClose={() => setDrawerOpen(false)} weekId={weekId!} date={date} />
    </Box>
  );
};

export default DailyLog;
