import { Box, IconButton } from "@mui/material";
import { CalorieLog } from "../db";
import DeleteIcon from "@mui/icons-material/Delete";

interface CalorieRowProps {
  log: CalorieLog;
  onDelete: (arg0: CalorieLog) => void;
}

export default function CalorieLogDisplay({ log, onDelete }: CalorieRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 1,
        borderRadius: 0.8,
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Light transparent overlay
        maxWidth: 400,
      }}
    >
      <Box sx={{ fontWeight: 500 }}>
        {log.calories}{" "}
        <Box component="span" sx={{ fontSize: "0.85em", opacity: 0.7 }}>
          kcal
        </Box>
      </Box>

      <IconButton onClick={() => onDelete(log)} size="small">
        <DeleteIcon></DeleteIcon>
      </IconButton>
    </Box>
  );
}
