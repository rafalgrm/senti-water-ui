import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const NewAreaDialog = ({ isOpen, handleAdd, handleClose }: { isOpen: boolean, handleAdd: () => void, handleClose: () => void }) => {

  return (
    <Dialog
        open={isOpen}
        onClose={handleClose}
    >
        <DialogTitle id="alert-dialog-title">
            Do you want to add this area?
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                This area will be added to the list of areas.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAdd} autoFocus>Add</Button>
        </DialogActions>
    </Dialog>
  );
};