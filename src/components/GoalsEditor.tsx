import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Stack, TextField, Button
} from '@mui/material';

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
    onSave: (goals: { calorieGoal: number; proteinGoal: number; carbGoal: number; fatGoal: number }) => void;
}

const GoalsEditor: React.FC<GoalsEditorProps> = ({ open, onClose, week, onSave }) => {
    const [calorieGoal, setCalorieGoal] = useState(week.calorieGoal);
    const [proteinGoal, setProteinGoal] = useState(week.proteinGoal);
    const [carbGoal, setCarbGoal] = useState(week.carbGoal);
    const [fatGoal, setFatGoal] = useState(week.fatGoal);

    const handleSave = () => {
        if ([calorieGoal, proteinGoal, carbGoal, fatGoal].some(v => !Number.isFinite(v) || v <= 0)) return;
        onSave({ calorieGoal, proteinGoal, carbGoal, fatGoal });
        onClose();
    };

    const perDay = (val: number) => Math.round(val / 7);

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
                        onChange={e => setCalorieGoal(Math.max(1, Number(e.target.value)))}
                        helperText={`= ${perDay(calorieGoal)} kcal/day`}
                        fullWidth
                    />
                    <TextField
                        type="number"
                        size="small"
                        label="Protein (g/week)"
                        value={proteinGoal}
                        onChange={e => setProteinGoal(Math.max(1, Number(e.target.value)))}
                        helperText={`= ${perDay(proteinGoal)} g/day`}
                        fullWidth
                    />
                    <TextField
                        type="number"
                        size="small"
                        label="Carbs (g/week)"
                        value={carbGoal}
                        onChange={e => setCarbGoal(Math.max(1, Number(e.target.value)))}
                        helperText={`= ${perDay(carbGoal)} g/day`}
                        fullWidth
                    />
                    <TextField
                        type="number"
                        size="small"
                        label="Fat (g/week)"
                        value={fatGoal}
                        onChange={e => setFatGoal(Math.max(1, Number(e.target.value)))}
                        helperText={`= ${perDay(fatGoal)} g/day`}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GoalsEditor;
