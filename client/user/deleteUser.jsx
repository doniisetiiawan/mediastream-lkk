import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Delete as DeleteIcon } from '@material-ui/icons';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { remove } from './api-user';
import auth from '../auth/auth-helper';

function DeleteUser(props) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const jwt = auth.isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const deleteAccount = () => {
    remove(
      {
        userId: props.userId,
      },
      { t: jwt.token },
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        auth.clearJWT(() => console.log('deleted'));
        setRedirect(true);
      }
    });
  };

  const handleRequestClose = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <span>
      <IconButton
        aria-label="Delete"
        onClick={clickButton}
        color="secondary"
      >
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRequestClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteAccount}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}

export default DeleteUser;
