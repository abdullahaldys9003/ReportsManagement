// 📂 components/CustomSelect.js
import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  disabled = false,
}) {
  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} label={label} disabled={disabled}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}