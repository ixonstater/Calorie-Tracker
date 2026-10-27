import { Button, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import BackspaceIcon from "@mui/icons-material/Backspace";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

export type NumberPadProps = {
  onEnter: (arg0: number) => void;
};

const NumberPad: React.FC<NumberPadProps> = ({ onEnter }: NumberPadProps) => {
  const [number, setNumber] = useState("");

  const addDigit = (digit: string) => {
    setNumber(number + digit);
  };

  const removeDigit = () => {
    setNumber(number.slice(0, -1));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, justifyContent: "center" }}>
      <Typography variant="body2" sx={{ fontSize: 20 }} fontWeight={700}>
        {number || "0"}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        <Button variant="outlined" onClick={() => addDigit("1")}>
          1
        </Button>
        <Button variant="outlined" onClick={() => addDigit("2")}>
          2
        </Button>
        <Button variant="outlined" onClick={() => addDigit("3")}>
          3
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        <Button variant="outlined" onClick={() => addDigit("4")}>
          4
        </Button>
        <Button variant="outlined" onClick={() => addDigit("5")}>
          5
        </Button>
        <Button variant="outlined" onClick={() => addDigit("6")}>
          6
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        <Button variant="outlined" onClick={() => addDigit("7")}>
          7
        </Button>
        <Button variant="outlined" onClick={() => addDigit("8")}>
          8
        </Button>
        <Button variant="outlined" onClick={() => addDigit("9")}>
          9
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "space-evenly" }}>
        <IconButton onClick={() => removeDigit()}>
          <BackspaceIcon />
        </IconButton>
        <Button variant="outlined" onClick={() => addDigit("0")}>
          0
        </Button>
        <IconButton
          onClick={() => {
            setNumber("");
            onEnter(Number(number));
          }}
        >
          <KeyboardReturnIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NumberPad;
