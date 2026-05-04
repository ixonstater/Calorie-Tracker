import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
} from "@mui/material";

interface GoalsEditorProps {
  open: boolean;
  onClose: () => void;
  week: {
    id?: number;
    calorieGoal: number;
    proteinGoal: number;
    carbGoal: number;
    fatGoal: number;
  };
  onSave: (goals: {
    calorieGoal: number;
    proteinGoal: number;
    carbGoal: number;
    fatGoal: number;
  }) => void;
}

const GoalsEditor: React.FC<GoalsEditorProps> = ({
  open,
  onClose,
  week,
  onSave,
}) => {
  const [calorieGoal, setCalorieGoal] = useState<number | "">(week.calorieGoal);
  const [proteinGoal, setProteinGoal] = useState<number | "">(week.proteinGoal);
  const [carbGoal, setCarbGoal] = useState<number | "">(week.carbGoal);
  const [fatGoal, setFatGoal] = useState<number | "">(week.fatGoal);

  const handleSave = () => {
    const safeCalorieGoal = calorieGoal === "" ? 0 : Number(calorieGoal);
    const safeProteinGoal = proteinGoal === "" ? 0 : Number(proteinGoal);
    const safeCarbGoal = carbGoal === "" ? 0 : Number(carbGoal);
    const safeFatGoal = fatGoal === "" ? 0 : Number(fatGoal);
    if (
      [safeCalorieGoal, safeProteinGoal, safeCarbGoal, safeFatGoal].some(
        (v) => !Number.isFinite(v) || v <= 0,
      )
    )
      return;
    onSave({
      calorieGoal: safeCalorieGoal,
      proteinGoal: safeProteinGoal,
      carbGoal: safeCarbGoal,
      fatGoal: safeFatGoal,
    });
    onClose();
  };

  const perDay = (val: number | "") => (val === "" ? 0 : Math.round(val / 7));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Week Goals</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            type="number"
            size="small"
            label="Calories (kcal/week)"
            value={calorieGoal}
            onChange={(e) =>
              setCalorieGoal(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            helperText={`= ${perDay(calorieGoal)} kcal/day`}
            fullWidth
          />
          <TextField
            type="number"
            size="small"
            label="Protein (g/week)"
            value={proteinGoal}
            onChange={(e) =>
              setProteinGoal(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            helperText={`= ${perDay(proteinGoal)} g/day`}
            fullWidth
          />
          <TextField
            type="number"
            size="small"
            label="Carbs (g/week)"
            value={carbGoal}
            onChange={(e) =>
              setCarbGoal(e.target.value === "" ? "" : Number(e.target.value))
            }
            helperText={`= ${perDay(carbGoal)} g/day`}
            fullWidth
          />
          <TextField
            type="number"
            size="small"
            label="Fat (g/week)"
            value={fatGoal}
            onChange={(e) =>
              setFatGoal(e.target.value === "" ? "" : Number(e.target.value))
            }
            helperText={`= ${perDay(fatGoal)} g/day`}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoalsEditor;
