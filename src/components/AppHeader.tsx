import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { useState } from "react";
import { getRandomFoodIcon } from "./randomFoodIcon";

interface AppHeaderProps {
  onFoodDbClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onFoodDbClick }) => {
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
            Calorie Tracker
          </Typography>
        </Box>
        <IconButton aria-label="Food DB" color="inherit" onClick={onFoodDbClick}>
          <FoodIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
