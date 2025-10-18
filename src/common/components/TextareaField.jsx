import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const TextareaField = ({ label, name, rows = 4, ...rest }) => {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      label={label}
      multiline
      rows={rows}
      fullWidth
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      {...rest}
    />
  );
};

export default TextareaField;