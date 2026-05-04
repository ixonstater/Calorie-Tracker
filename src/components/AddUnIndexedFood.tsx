import React, { useState } from "react";
import { Drawer, Box, Typography, TextField, Button, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { db, Food } from "../db";

interface AddUnIndexedFoodProps {
  open: boolean;
  onClose: () => void;
  weekId: number;
  date: string;
}

const AddUnIndexedFood: React.FC<AddUnIndexedFoodProps> = ({ open, onClose, weekId, date }) => {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState<number | "">(0);
  const [servings, setServings] = useState<number | "">(1);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    const safeName = foodName.trim();
    const safeCalories = calories === "" ? 0 : Number(calories);
    const safeServings = servings === "" ? 0 : Number(servings);

    if (!safeName || safeCalories < 0 || safeServings <= 0) return;

    setSaving(true);
    try {
      // Create a new food entry with defaults for protein, carbs, fat
      const newFood: Food = {
        name: safeName,
        calories: safeCalories,
        protein: 0,
        carbs: 0,
        fat: 0,
        servingSize: 1,
        servingUnit: "serving",
      };

      const foodId = await db.foods.add(newFood);

      // Add the log entry
      await db.logs.add({
        weekId,
        date,
        foodId,
        servings: safeServings,
        timestamp: Date.now(),
      });

      // Reset form and close
      setFoodName("");
      setCalories(0);
      setServings(1);
      setSaving(false);
      onClose();
    } catch (error) {
      setSaving(false);
      console.error("Error adding UnIndexed food:", error);
    }
  };

  const calculatedCalories = (calories === "" ? 0 : calories) * (servings === "" ? 0 : servings);

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
        <Typography variant="h6">Log Un-Indexed Food</Typography>

        <Divider sx={{ my: 2 }} />

        <TextField fullWidth size="small" label="Food Name" placeholder="e.g., Chicken Sandwich" value={foodName} onChange={(e) => setFoodName(e.target.value)} sx={{ mb: 2 }} />

        <TextField
          fullWidth
          size="small"
          type="number"
          label="Calories per Serving"
          inputProps={{ step: 1, min: 0 }}
          value={calories}
          onChange={(e) => {
            const val = e.target.value;
            setCalories(val === "" ? "" : Math.max(0, Number(val)));
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          type="number"
          label="Servings"
          inputProps={{ step: 0.25, min: 0.25 }}
          value={servings}
          onChange={(e) => {
            const val = e.target.value;
            setServings(val === "" ? "" : Math.max(0.25, Number(val)));
          }}
          sx={{ mb: 2 }}
        />

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Total: {Math.round(calculatedCalories)} kcal
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={handleAdd}
          disabled={!foodName.trim() || calories === "" || calories === 0 || servings === "" || servings <= 0 || saving}
          startIcon={<AddIcon />}
        >
          Add to Log
        </Button>
      </Box>
    </Drawer>
  );
};

export default AddUnIndexedFood;
