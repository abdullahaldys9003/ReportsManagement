import React from "react";

const SelectFilter = ({ label, options, value, onChange }) => {
  return (
    <div className="filter">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectFilter;