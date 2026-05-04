import { db } from "../db";
import { getCurrentMondayDate } from "../utils/date";

const DEFAULTS = {
  calorieGoal: 14000,
  proteinGoal: 1050,
  carbGoal: 1400,
  fatGoal: 455,
};

export async function ensureCurrentWeek(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const mondayDate = getCurrentMondayDate();
  const currentWeek = await db.weeks
    .where("mondayDate")
    .equals(mondayDate)
    .first();
  if (currentWeek) {
    setLoading(false);
    return;
  }

  const prior = await db.weeks.orderBy("mondayDate").reverse().first();
  try {
    await db.weeks.add({
      mondayDate,
      calorieGoal: prior?.calorieGoal ?? DEFAULTS.calorieGoal,
      proteinGoal: prior?.proteinGoal ?? DEFAULTS.proteinGoal,
      carbGoal: prior?.carbGoal ?? DEFAULTS.carbGoal,
      fatGoal: prior?.fatGoal ?? DEFAULTS.fatGoal,
    });
  } catch (e) {
    console.warn(
      "An error occurred while saving a new week object.  This is probably fine.",
      e,
    );
  }
  setLoading(false);
}
