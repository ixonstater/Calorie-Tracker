import React, { useState } from "react";
import { Drawer, Box, Typography, TextField, List, ListItemButton, ListItemText, Chip, Button, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useLiveQuery } from "dexie-react-hooks";
import { db, Food } from "../db";

interface AddFoodEntryProps {
  open: boolean;
  onClose: () => void;
  weekId: number;
  date: string;
}

const AddFoodEntry: React.FC<AddFoodEntryProps> = ({ open, onClose, weekId, date }) => {
  const foods = useLiveQuery(() => db.foods.toArray(), []);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Food | null>(null);
  const [servings, setServings] = useState<number | "">(1);
  const [saving, setSaving] = useState(false);

  const filteredFoods = foods?.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())) ?? [];

  const handleSelect = (food: Food) => {
    setSelected(food);
    setServings(1);
  };

  const handleAdd = async () => {
    const safeServings = servings === "" ? 0 : Number(servings);
    if (!selected || safeServings <= 0) return;
    setSaving(true);
    await db.logs.add({
      weekId,
      date,
      foodId: selected.id!,
      servings: safeServings,
      timestamp: Date.now(),
    });
    setSaving(false);
    setSelected(null);
    setServings(1);
    onClose();
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose} PaperProps={{ sx: { maxHeight: "80vh", borderRadius: "16px 16px 0 0" } }}>
      <Box sx={{ width: "100%", px: 2, pt: 1 }}>
        {/* Drag handle */}
        <Box
          sx={{
            width: 40,
            height: 4,
            bgcolor: "divider",
            borderRadius: 2,
            mx: "auto",
            mt: 1,
            mb: 2,
          }}
        />
        <Typography variant="h6">Log Food</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search foods…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
          sx={{ my: 2 }}
        />
        <List>
          {filteredFoods.map(
            (food) =>
              !food.unIndexed!! && (
                <ListItemButton key={food.id} onClick={() => handleSelect(food)}>
                  <ListItemText primary={food.name} />
                  <Chip label={`${food.calories} kcal`} size="small" />
                </ListItemButton>
              ),
          )}
        </List>
        {selected && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              {selected.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              1 serving = {selected.calories} kcal · P {selected.protein}g · C {selected.carbs}g · F {selected.fat}g
            </Typography>
            <TextField
              type="number"
              size="small"
              label="Servings"
              inputProps={{ step: 0.25, min: 0.25 }}
              value={servings}
              onChange={(e) => {
                const val = e.target.value;
                setServings(val === "" ? "" : Math.max(0.25, Number(val)));
              }}
              sx={{ width: 120, mr: 2 }}
            />
            <Chip label={`≈ ${Math.round((servings === "" ? 0 : servings) * selected.calories)} kcal`} color="primary" size="small" sx={{ ml: 2 }} />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleAdd} disabled={servings === "" || servings <= 0 || saving} startIcon={<AddIcon />}>
              Add to Log
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default AddFoodEntry;
