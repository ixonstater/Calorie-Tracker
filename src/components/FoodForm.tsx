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
    const [name, setName] = useState(initial?.name ?? '');
    const [category, setCategory] = useState(initial?.category ?? 'Other');
    const [calories, setCalories] = useState(initial?.calories ?? '');
    const [protein, setProtein] = useState(initial?.protein ?? '');
    const [carbs, setCarbs] = useState(initial?.carbs ?? '');
    const [fat, setFat] = useState(initial?.fat ?? '');
    const [servingSize, setServingSize] = useState(initial?.servingSize ?? '');
    const [servingUnit, setServingUnit] = useState(initial?.servingUnit ?? 'g');

    const handleSave = () => {
        // Replace falsy values with 0 for numbers
        const safeCalories = calories === '' ? 0 : Number(calories);
        const safeProtein = protein === '' ? 0 : Number(protein);
        const safeCarbs = carbs === '' ? 0 : Number(carbs);
        const safeFat = fat === '' ? 0 : Number(fat);
        const safeServingSize = servingSize === '' ? 0 : Number(servingSize);
        if (!name || safeCalories <= 0 || safeProtein < 0 || safeCarbs < 0 || safeFat < 0 || safeServingSize <= 0) return;
        onSave({
            name,
            category,
            calories: safeCalories,
            protein: safeProtein,
            carbs: safeCarbs,
            fat: safeFat,
            servingSize: safeServingSize,
            servingUnit
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initial ? 'Edit Food' : 'Add Food'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} mt={1}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Name"
                            size="small"
                            fullWidth
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
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
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            label="Calories"
                            type="number"
                            size="small"
                            fullWidth
                            value={calories}
                            onChange={e => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            label="Protein"
                            type="number"
                            size="small"
                            fullWidth
                            value={protein}
                            onChange={e => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            label="Carbs"
                            type="number"
                            size="small"
                            fullWidth
                            value={carbs}
                            onChange={e => setCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            label="Fat"
                            type="number"
                            size="small"
                            fullWidth
                            value={fat}
                            onChange={e => setFat(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField
                            label="Serving Size"
                            type="number"
                            size="small"
                            fullWidth
                            value={servingSize}
                            onChange={e => setServingSize(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
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
