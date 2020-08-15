import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { remove } from './api-media';
import auth from '../auth/auth-helper';

function DeleteMedia(props) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const jwt = auth.isAuthenticated();

  const clickButton = () => {
    setOpen(true);
  };

  const deleteMedia = () => {
    remove(
      {
        mediaId: props.mediaId,
      },
      { t: jwt.token },
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
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
        <DialogTitle>
          {`Delete ${props.mediaTitle}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete {props.mediaTitle} from your
            account.
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
            onClick={deleteMedia}
            variant="contained"
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

export default DeleteMedia;
