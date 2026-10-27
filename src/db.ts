import Dexie, { type Table } from "dexie";

export interface CalorieLog {
  id?: number;
  date: string;
  mondayDate: string;
  calories: number;
  timestamp: number;
}

const DB_VERSION = 1;
export class CalorieTrackerDB extends Dexie {
  calorieLogs!: Table<CalorieLog, number>;

  constructor() {
    super("CalorieTracker");
    this.version(DB_VERSION).stores({
      calorieLogs: "++id, mondayDate, date",
    });
  }
}

export const db = new CalorieTrackerDB();
