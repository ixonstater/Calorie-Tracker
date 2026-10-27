import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useState } from "react";
import { getRandomFoodIcon } from "./randomFoodIcon";

const AppHeader: React.FC = () => {
  // Pick a random food icon on mount
  const [FoodIcon] = useState(() => getRandomFoodIcon());
  return (
    <AppBar
      position="sticky"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: 0,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 56 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" color="primary" fontWeight={700}>
            Calorie Tracker v2
          </Typography>
        </Box>
        <FoodIcon />
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
