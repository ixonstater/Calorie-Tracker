import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { getCurrentMondayDate, getWeekDates, getDayAbbr, getDateNumber } from "../utils/date";
import NumberPad from "./NumberPad";
import { useLiveQuery } from "dexie-react-hooks";
import { CalorieLog, db } from "../db";
import CalorieLogDisplay from "./CalorieLogDisplay";

const today = new Date();
const formatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const todayDateString = formatter.format(today);

const WeekView: React.FC = () => {
  const mondayDate = getCurrentMondayDate();
  const weekDates = getWeekDates(mondayDate);
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    return weekDates.indexOf(todayDateString) !== -1 ? weekDates.indexOf(todayDateString) : 0;
  });

  const logs = useLiveQuery(async () => {
    const selectedDate = weekDates[selectedDayIndex];
    const results = await db.calorieLogs.where("date").equals(selectedDate).toArray();
    return results.sort((a, b) => b.timestamp - a.timestamp);
  }, [weekDates, selectedDayIndex]);

  const weeklyTotal = useLiveQuery(async () => {
    const results = await db.calorieLogs.toArray();
    return results.map((x) => x.calories).reduce((carry: number, next: number) => carry + next, 0);
  });

  const deleteLog = (log: CalorieLog) => {
    if (!log.id) {
      return;
    }

    db.calorieLogs.delete(log.id);
  };

  return (
    <>
      <Box sx={{ paddingTop: 3 }}>
        <Typography variant="h6">Weekly Total: {weeklyTotal}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Tabs value={selectedDayIndex} onChange={(_, idx) => setSelectedDayIndex(idx)} variant="scrollable" scrollButtons={false} sx={{ px: 1, mt: 2 }}>
          {weekDates.map((date, _) => {
            const isToday = date === todayDateString;
            return (
              <Tab
                key={date}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <span>{getDayAbbr(date)}</span>
                    <span style={{ fontSize: 12 }}>{getDateNumber(date)}</span>
                    {isToday && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -6,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 6,
                          height: 6,
                          bgcolor: "primary.main",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </Box>
                }
                sx={isToday ? { color: "primary.main" } : {}}
              />
            );
          })}
        </Tabs>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <NumberPad
          onEnter={(value) => {
            db.calorieLogs.add({
              date: weekDates[selectedDayIndex],
              mondayDate: mondayDate,
              calories: value,
              timestamp: Date.now(),
            });
          }}
        ></NumberPad>
      </Box>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", padding: 2, paddingTop: 5, justifyContent: "space-evenly" }}>
        {logs?.map((log) => (
          <CalorieLogDisplay key={log.timestamp} onDelete={deleteLog} log={log}></CalorieLogDisplay>
        ))}
      </Box>
    </>
  );
};

export default WeekView;
