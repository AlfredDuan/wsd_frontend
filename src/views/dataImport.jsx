import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SettingsOverscan from "@material-ui/icons/SettingsOverscan";
import CloudUpload from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import InfoContext from "../context/infoContext";
import { getFileList, importCSVFiles } from "../services/readingService";
import { getMeterInfo } from "../utils/info";
import SelectableTable from "../components/common/selectableTable";
import NoRecord from "../components/common/noRecord";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  paper: {
    minWidth: "80%",
    margin: 30,
    padding: 20,
    minHeight: 550,
  },
  scan: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    width: 100,
  },
}));

const DataImport = () => {
  const [scanFolderName, setScanFolderName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [fullRows, setFullRows] = React.useState([]);
  const [scanned, setScanned] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [overwrite, setOverwrite] = React.useState(false);

  const { meters } = useContext(InfoContext);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleScan = async () => {
    const result = await getFileList(scanFolderName);
    const fileList = result.data.fileList;

    const lFullRows = fileList
      .map((file) => {
        const meterInfo = getMeterInfo(meters, file.fileName.split(".")[0]);

        if (!meterInfo) {
          // console.log(`Cannot found meter info for ${file.fileName.split(".")[0]}`)
          enqueueSnackbar(
            `Cannot found meter info for ${file.fileName.split(".")[0]}`,
            {
              variant: "error",
            }
          );
          return null;
        }
        const { region, locationTag, meterTag } = meterInfo;

        return {
          name: file.fileName,
          fileName: file.fileName,
          fromDate: file.fromDate,
          toDate: file.toDate,
          noOfRecords: file.noOfRecords,
          region,
          locationTag,
          meterTag,
        };
      })
      .filter((x) => x !== null);
    setFullRows(lFullRows);
    setFolderName(scanFolderName);
    setScanned(true);
  };

  const handleUpload = async () => {
    const folderPath = folderName;
    const fileList = selected;
    const result = await importCSVFiles(folderPath, fileList, overwrite);

    if (result.status === 200) {
      enqueueSnackbar(`Request to import CSV files submitted.`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(
        `Request to import CSV files cannot be submitted. Message: ${result.data.message}`,
        {
          variant: "error",
        }
      );
    }
  };

  const headCells = [
    {
      id: "fileName",
      disablePadding: true,
      label: "File Name",
    },
    { id: "region", disablePadding: false, label: "Region" },
    {
      id: "locationTag",
      disablePadding: false,
      label: "Location Tag",
    },
    {
      id: "meterTag",
      disablePadding: false,
      label: "Meter Tag",
    },
    {
      id: "fromDate",
      disablePadding: false,
      label: "From Date",
    },
    {
      id: "toDate",
      disablePadding: false,
      label: "To Date",
    },
    {
      id: "noOfRecords",
      disablePadding: false,
      label: "Records",
    },
  ];

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={2}>
        <div className={classes.scan}>
          <TextField
            className={classes.margin}
            id="input-with-icon-textfield"
            label="Scan Folder"
            placeholder="folder name..."
            margin="dense"
            onChange={(e) => {
              setScanFolderName(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">csv\</InputAdornment>
              ),
            }}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled={scanFolderName.length === 0}
            onClick={handleScan}
            endIcon={<SettingsOverscan />}
          >
            Scan
          </Button>
          {scanned && fullRows.length !== 0 && (
            <>
              <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={handleUpload}
                disabled={selected.length === 0}
                endIcon={<CloudUpload />}
              >
                Upload
              </Button>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={overwrite}
                    onChange={() => setOverwrite(!overwrite)}
                    name="overwrite"
                    inputProps={{ "aria-label": "primary checkbox" }}
                    color="primary"
                    disabled={selected.length === 0}
                  />
                }
                label="Overwrite existing records?"
              />
            </>
          )}
        </div>
        {scanned && fullRows.length !== 0 && (
          <SelectableTable
            fullRows={fullRows}
            headCells={headCells}
            title="Files to be imported"
            selected={selected}
            setSelected={setSelected}
          />
        )}
        {scanned && fullRows.length === 0 && <NoRecord />}
      </Paper>
    </div>
  );
};

export default DataImport;
