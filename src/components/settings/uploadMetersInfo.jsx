import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";

import Attachment from "@material-ui/icons/Attachment";
import { Divider } from "@material-ui/core";
import { useSnackbar } from "notistack";

import { uploadMeterFiles } from "../../services/infoService";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  chip: {
    margin: 5,
  },
}));

export default function UploadMetersInfo({ open, setOpen, updatedMeterInfo }) {
  const [files, setFiles] = useState([]);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpload = async () => {
    const result = await uploadMeterFiles(files);
    if (result.status === 200) {
      updatedMeterInfo();
      setOpen(false);
    } else {
      enqueueSnackbar(
        `Information of Water Flow Meters cannot be updated. Message: ${result.data.message}`,
        {
          variant: "error",
        }
      );
    }
  };

  const handleDelete = (fileName) => {
    const oldFiles = files.filter((f) => f.name !== fileName);
    setFiles(oldFiles);
  };

  const handleFileSelect = (e) => {
    const lFiles = Object.values(e.target.files);
    const oldFiles = [...files];

    const newFiles = lFiles.filter((f1) => {
      return oldFiles.findIndex((f2) => f2.name === f1.name) === -1;
    });

    setFiles([...oldFiles, ...newFiles]);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          Upload Meters Infomation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select CSV files to upload meters infomation.
          </DialogContentText>
          <DialogContentText color="error">
            Note: Existing records will be overwritten!
          </DialogContentText>
          <input
            accept=".csv"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={handleFileSelect}
            multiple
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <Attachment />
            </IconButton>
          </label>
          <div>
            {files.map((file) => {
              return (
                <Chip
                  className={classes.chip}
                  key={file.name}
                  label={file.name}
                  onDelete={() => handleDelete(file.name)}
                  variant="outlined"
                />
              );
            })}
          </div>

          <Divider />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            color="primary"
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
