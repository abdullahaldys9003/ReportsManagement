import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function Notification({ open, setOpen, message, severity }) {
  // severity: "success", "error", "warning", "info"
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}