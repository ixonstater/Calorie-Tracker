// Utility to ensure a week exists for a given mondayDate
import { db, Week } from '../db';

const DEFAULTS = {
    calorieGoal: 14000,
    proteinGoal: 1050,
    carbGoal: 1400,
    fatGoal: 455,
};

/**
 * Ensures a week exists for the given mondayDate. If not, creates it.
 * If a prior week exists, copies its goals. Otherwise uses defaults.
 * Returns the week record (after creation if needed).
 */
export async function ensureWeekExists(mondayDate: string): Promise<Week> {
    let week = await db.weeks.where('mondayDate').equals(mondayDate).first();
    if (week) return week;
    // Find most recent prior week
    const prior = await db.weeks
        .where('mondayDate')
        .below(mondayDate)
        .reverse()
        .first();
    const goals = prior
        ? {
            calorieGoal: prior.calorieGoal,
            proteinGoal: prior.proteinGoal,
            carbGoal: prior.carbGoal,
            fatGoal: prior.fatGoal,
        }
        : DEFAULTS;
    const id = await db.weeks.add({
        mondayDate,
        ...goals,
    });
    week = await db.weeks.get(id);
    return week!;
}
