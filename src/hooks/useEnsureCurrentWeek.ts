import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getCurrentMondayDate } from '../utils/date';

const DEFAULTS = {
    calorieGoal: 14000,
    proteinGoal: 1050,
    carbGoal: 1400,
    fatGoal: 455,
};


export function useEnsureCurrentWeek() {
    const [loading, setLoading] = useState(true);
    const mondayDate = getCurrentMondayDate();
    const week = useLiveQuery(
        () => db.weeks.where('mondayDate').equals(mondayDate).first(),
        [mondayDate]
    );

    useEffect(() => {
        if (week === undefined) return;
        if (week) {
            setLoading(false);
            return;
        }
        (async () => {
            const prior = await db.weeks.orderBy('mondayDate').reverse().first();
            await db.weeks.add({
                mondayDate,
                calorieGoal: prior?.calorieGoal ?? DEFAULTS.calorieGoal,
                proteinGoal: prior?.proteinGoal ?? DEFAULTS.proteinGoal,
                carbGoal: prior?.carbGoal ?? DEFAULTS.carbGoal,
                fatGoal: prior?.fatGoal ?? DEFAULTS.fatGoal,
            });
            setLoading(false);
        })();
    }, [week, mondayDate]);

    return { week, loading };
}
