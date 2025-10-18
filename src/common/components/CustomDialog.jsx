import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open,handleClose,children,handleSave}) {

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>الغاء</Button>
          <Button type="submit" onClick={handleSave} form="subscription-form">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

