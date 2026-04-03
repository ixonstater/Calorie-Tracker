import React, { useState } from 'react';
import { Box, Stack, Typography, IconButton, Button, Paper, LinearProgress, Grid, Tabs, Tab } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import DailyLog from './DailyLog';
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

    // Navigation logic
    const handlePrevWeek = () => {
        const prev = new Date(mondayDate);
        prev.setDate(prev.getDate() - 7);
        setMondayDate(prev.toISOString().split('T')[0]);
        setSelectedDayIndex(0);
    };
    const handleNextWeek = () => {
        const next = new Date(mondayDate);
        next.setDate(next.getDate() + 7);
        setMondayDate(next.toISOString().split('T')[0]);
        setSelectedDayIndex(0);
    };
    // Block navigating past current week
    const isCurrentWeek = mondayDate === getCurrentMondayDate();

    // Edit goals (to be implemented)
    const handleEditGoals = () => {
        // Open goals editor dialog
    };

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
            </Stack>

            {/* Weekly Summary Card (to be implemented) */}
            <Paper sx={{ m: 2, p: 2 }}>
                <Typography variant="body2" color="text.secondary">WEEKLY TOTAL</Typography>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                    0 / {week?.calorieGoal ?? '--'} kcal
                </Typography>
                <LinearProgress variant="determinate" value={0} color="primary" sx={{ my: 1 }} />
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">Protein</Typography>
                        <Typography sx={{ fontFamily: 'monospace' }}>0/{week?.proteinGoal ?? '--'}g</Typography>
                        <LinearProgress variant="determinate" value={0} sx={{ bgcolor: '#134E4A', '& .MuiLinearProgress-bar': { bgcolor: '#2DD4BF' } }} />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">Carbs</Typography>
                        <Typography sx={{ fontFamily: 'monospace' }}>0/{week?.carbGoal ?? '--'}g</Typography>
                        <LinearProgress variant="determinate" value={0} color="secondary" />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">Fat</Typography>
                        <Typography sx={{ fontFamily: 'monospace' }}>0/{week?.fatGoal ?? '--'}g</Typography>
                        <LinearProgress variant="determinate" value={0} sx={{ bgcolor: '#0E3A5E', '& .MuiLinearProgress-bar': { bgcolor: '#38BDF8' } }} />
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
