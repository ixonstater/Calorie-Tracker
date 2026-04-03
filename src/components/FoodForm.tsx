import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, TextField, Button, MenuItem
} from '@mui/material';
import { Food } from '../db';

const categories = [
    'Protein', 'Carbs', 'Fat', 'Dairy', 'Vegetable', 'Fruit', 'Snack', 'Other'
];
const units = ['g', 'oz', 'cup', 'ml', 'tbsp', 'tsp', 'piece'];

interface FoodFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (food: Omit<Food, 'id'>) => void;
    initial?: Partial<Food>;
}

const FoodForm: React.FC<FoodFormProps> = ({ open, onClose, onSave, initial }) => {
    const [name, setName] = useState(initial?.name || '');
    const [category, setCategory] = useState(initial?.category || '');
    const [calories, setCalories] = useState(initial?.calories || 0);
    const [protein, setProtein] = useState(initial?.protein || 0);
    const [carbs, setCarbs] = useState(initial?.carbs || 0);
    const [fat, setFat] = useState(initial?.fat || 0);
    const [servingSize, setServingSize] = useState(initial?.servingSize || 0);
    const [servingUnit, setServingUnit] = useState(initial?.servingUnit || 'g');

    const handleSave = () => {
        if (!name || calories <= 0 || protein < 0 || carbs < 0 || fat < 0 || servingSize <= 0) return;
        onSave({ name, category, calories, protein, carbs, fat, servingSize, servingUnit });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initial ? 'Edit Food' : 'Add Food'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} mt={1}>
                    <Grid size={{ xs: 8 }}>
                        <TextField
                            label="Name"
                            size="small"
                            fullWidth
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <TextField
                            label="Category"
                            size="small"
                            select
                            fullWidth
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                            <MenuItem value="">Other</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <TextField
                            label="Calories"
                            type="number"
                            size="small"
                            fullWidth
                            value={calories}
                            onChange={e => setCalories(Number(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <TextField
                            label="Protein"
                            type="number"
                            size="small"
                            fullWidth
                            value={protein}
                            onChange={e => setProtein(Number(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <TextField
                            label="Carbs"
                            type="number"
                            size="small"
                            fullWidth
                            value={carbs}
                            onChange={e => setCarbs(Number(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 3 }}>
                        <TextField
                            label="Fat"
                            type="number"
                            size="small"
                            fullWidth
                            value={fat}
                            onChange={e => setFat(Number(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <TextField
                            label="Serving Size"
                            type="number"
                            size="small"
                            fullWidth
                            value={servingSize}
                            onChange={e => setServingSize(Number(e.target.value))}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <TextField
                            label="Serving Unit"
                            size="small"
                            select
                            fullWidth
                            value={servingUnit}
                            onChange={e => setServingUnit(e.target.value)}
                        >
                            {units.map(unit => (
                                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FoodForm;
