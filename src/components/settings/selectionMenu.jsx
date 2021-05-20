import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectionMenu({ open, handleClose, setPage }) {
  const handleClick = (page) => {
    setPage(page);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {"Select Settings..."}
      </DialogTitle>
      <DialogContent>
        <List>
          <ListItem button onClick={() => handleClick("accounts")}>
            <ListItemText
              primary="Accounts Information"
              secondary="editing Users' Information and their roles."
            />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleClick("waterFlowMeters")}>
            <ListItemText
              primary="Water Flow Meters Information"
              secondary="add, update or delete water flow meters' records."
            />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleClick("eventTypes")}>
            <ListItemText
              primary="Defining Event Types"
              secondary="add, update or delete event types."
            />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleClick("additionalFunction")}>
            <ListItemText
              primary="Additional function"
              secondary="model training"
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
