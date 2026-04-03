import React, { useState } from 'react';
import { Box, Stack, Typography, IconButton, Button, Paper, LinearProgress, Grid, Tabs, Tab } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { ensureWeekExists } from '../utils/ensureWeekExists';
import DailyLog from './DailyLog';
import GoalsEditor from './GoalsEditor';
import { getCurrentMondayDate, getWeekDates, formatWeekRange, getDayAbbr, getDateNumber } from '../utils/date';

const today = new Date();

const WeekView: React.FC = () => {
    // State for week navigation
    const [mondayDate, setMondayDate] = useState(getCurrentMondayDate());
    const week = useLiveQuery(() => db.weeks.where('mondayDate').equals(mondayDate).first(), [mondayDate]);
    const weekDates = getWeekDates(mondayDate);
    const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
        const todayStr = today.toISOString().split('T')[0];
        return weekDates.indexOf(todayStr) !== -1 ? weekDates.indexOf(todayStr) : 0;
    });

    // Weekly summary calculation
    const foods = useLiveQuery(() => db.foods.toArray(), []);
    const logs = useLiveQuery(
        () => db.logs.where('weekId').equals(week?.id ?? -1).toArray(),
        [week?.id]
    );
    let summary = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    if (logs && foods) {
        for (const log of logs) {
            const food = foods.find(f => f.id === log.foodId);
            if (food) {
                summary.calories += log.servings * food.calories;
                summary.protein += log.servings * food.protein;
                summary.carbs += log.servings * food.carbs;
                summary.fat += log.servings * food.fat;
            }
        }
    }

    // Navigation logic
    const handlePrevWeek = async () => {
        const prev = new Date(mondayDate);
        prev.setDate(prev.getDate() - 7);
        const prevMonday = prev.toISOString().split('T')[0];
        await ensureWeekExists(prevMonday);
        setMondayDate(prevMonday);
        setSelectedDayIndex(0);
    };
    const handleNextWeek = async () => {
        const next = new Date(mondayDate);
        next.setDate(next.getDate() + 7);
        const nextMonday = next.toISOString().split('T')[0];
        setMondayDate(nextMonday);
        setSelectedDayIndex(0);
    };
    // Block navigating past current week
    const isCurrentWeek = mondayDate === getCurrentMondayDate();


    // Goals editor dialog state
    const [goalsOpen, setGoalsOpen] = useState(false);
    const handleEditGoals = () => setGoalsOpen(true);
    const handleCloseGoals = () => setGoalsOpen(false);
    const handleSaveGoals = async (goals: { calorieGoal: number; proteinGoal: number; carbGoal: number; fatGoal: number }) => {
        if (!week) return;
        await db.weeks.update(week.id!, goals);
    };

    // Progress calculations
    const pct = (val: number, goal: number | undefined) => goal && goal > 0 ? Math.min(100, (val / goal) * 100) : 0;

    return (
        <Box>
            {/* Week Header Bar */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
                <IconButton aria-label="Previous week" onClick={handlePrevWeek}>
                    <ChevronLeftIcon />
                </IconButton>
                <Typography variant="subtitle1" fontWeight={600}>
                    {formatWeekRange(mondayDate)}
                </Typography>
                <IconButton aria-label="Next week" onClick={handleNextWeek} disabled={isCurrentWeek}>
                    <ChevronRightIcon />
                </IconButton>
                <Button variant="outlined" size="small" startIcon={<EditIcon />} sx={{ ml: 2 }} onClick={handleEditGoals}>
                    Goals
                </Button>
                {/* Goals Editor Dialog */}
                {week && (
                    <GoalsEditor
                        open={goalsOpen}
                        onClose={handleCloseGoals}
                        week={week}
                        onSave={handleSaveGoals}
                    />
                )}
            </Stack>

            {/* Weekly Summary Card */}
            <Paper sx={{ m: 2, p: 2 }}>
                <Typography variant="body2" color="text.secondary">WEEKLY TOTAL</Typography>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                    {Math.round(summary.calories)} / {week?.calorieGoal ?? '--'} kcal
                </Typography>
                <LinearProgress variant="determinate" value={pct(summary.calories, week?.calorieGoal)} color="primary" sx={{ my: 1 }} />
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">Protein</Typography>
                        <Typography sx={{ fontFamily: 'monospace' }}>{Math.round(summary.protein)}/{week?.proteinGoal ?? '--'}g</Typography>
                        <LinearProgress variant="determinate" value={pct(summary.protein, week?.proteinGoal)} sx={{ bgcolor: '#134E4A', '& .MuiLinearProgress-bar': { bgcolor: '#2DD4BF' } }} />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">Carbs</Typography>
                        <Typography sx={{ fontFamily: 'monospace' }}>{Math.round(summary.carbs)}/{week?.carbGoal ?? '--'}g</Typography>
                        <LinearProgress variant="determinate" value={pct(summary.carbs, week?.carbGoal)} color="secondary" />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">Fat</Typography>
                        <Typography sx={{ fontFamily: 'monospace' }}>{Math.round(summary.fat)}/{week?.fatGoal ?? '--'}g</Typography>
                        <LinearProgress variant="determinate" value={pct(summary.fat, week?.fatGoal)} sx={{ bgcolor: '#0E3A5E', '& .MuiLinearProgress-bar': { bgcolor: '#38BDF8' } }} />
                    </Grid>
                </Grid>
            </Paper>

            {/* Day Selector Tabs */}
            <Tabs
                value={selectedDayIndex}
                onChange={(_, idx) => setSelectedDayIndex(idx)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 1, mt: 2 }}
            >
                {weekDates.map((date, _) => {
                    const isToday = date === today.toISOString().split('T')[0];
                    return (
                        <Tab
                            key={date}
                            label={
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                    <span>{getDayAbbr(date)}</span>
                                    <span style={{ fontSize: 12 }}>{getDateNumber(date)}</span>
                                    {isToday && (
                                        <Box sx={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%' }} />
                                    )}
                                </Box>
                            }
                            sx={isToday ? { color: 'primary.main' } : {}}
                        />
                    );
                })}
            </Tabs>

            {/* Daily Log Panel */}
            <Box sx={{ mt: 2 }}>
                {week && (
                    <DailyLog weekId={week.id} date={weekDates[selectedDayIndex]} />
                )}
            </Box>
        </Box>
    );
};

export default WeekView;
