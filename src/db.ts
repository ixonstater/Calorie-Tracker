import Dexie, { type Table } from 'dexie';

export interface Food {
    id?: number;
    name: string;
    category?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: number;
    servingUnit: string;
}

export interface Week {
    id?: number;
    mondayDate: string;
    calorieGoal: number;
    proteinGoal: number;
    carbGoal: number;
    fatGoal: number;
}

export interface Log {
    id?: number;
    weekId: number;
    date: string;
    foodId: number;
    servings: number;
    timestamp: number;
}

const DB_VERSION = 1;
export class CalorieTrackerDB extends Dexie {
    foods!: Table<Food, number>;
    weeks!: Table<Week, number>;
    logs!: Table<Log, number>;

    constructor() {
        super('CalorieTracker');
        this.version(DB_VERSION).stores({
            foods: '++id, name, category',
            weeks: '++id, &mondayDate',
            logs: '++id, [weekId+date], weekId, date, foodId',
        });
    }
}

export const db = new CalorieTrackerDB();
