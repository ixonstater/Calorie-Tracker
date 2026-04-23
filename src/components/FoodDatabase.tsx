import React, { useState } from 'react';
import {
  Box, Typography, IconButton, Button, List, ListItem, ListItemText, Chip, Divider, TextField, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Food } from '../db';
import FoodForm from './FoodForm';


const FoodDatabase: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const foods = useLiveQuery(() => db.foods.toArray(), []);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editFood, setEditFood] = useState<Food | null>(null);

  const filtered = foods?.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) ?? [];

  const handleAdd = () => {
    setEditFood(null);
    setFormOpen(true);
  };
  const handleEdit = (food: Food) => {
    setEditFood(food);
    setFormOpen(true);
  };
  const handleDelete = async (id: number) => {
    await db.foods.delete(id);
  };
  const handleSave = async (food: Omit<Food, 'id'>) => {
    if (editFood) {
      await db.foods.update(editFood.id!, food);
    } else {
      await db.foods.add(food);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2, pt: 2 }}>
        <IconButton onClick={onBack} aria-label="Back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Food Database</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAdd}>
          New Food
        </Button>
      </Stack>

      {/* Search Bar */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name…"
        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ my: 2, px: 2 }}
      />

      {/* Food List */}
      <List>
        {filtered.length === 0 && (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary">No foods yet. Add your first food to get started.</Typography>
          </Box>
        )}
        {filtered.map(food => (
          <React.Fragment key={food.id}>
            <ListItem
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="Edit" onClick={() => handleEdit(food)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="Delete" color="error" onClick={() => handleDelete(food.id!)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={
                  <>
                    <Typography fontWeight={600} component="span">{food.name}</Typography>
                    {food.category && (
                      <Chip label={food.category} size="small" sx={{ ml: 1 }} />
                    )}
                  </>
                }
                secondary={
                  <Typography color="text.secondary">
                    {food.calories} kcal · P {food.protein}g · C {food.carbs}g · F {food.fat}g · per {food.servingSize} {food.servingUnit}
                  </Typography>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>

      {/* Food Form Dialog */}
      <FoodForm
        key={editFood?.id || "new"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editFood ?? undefined}
      />
    </Box>
  );
};

export default FoodDatabase;
