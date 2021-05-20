import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import moment from "moment";

import TimePlot from "./timePlot";
import AbnormalityTable from "./abnormalityTable";
import CustomDatePicker from "../components/common/customDatePicker";
import CustomSelect from "../components/common/customSelect";
import CustomTextField from "../components/common/customTextField";
import { statusDict } from "../utils/helpers";
import { updateEvent } from "../services/readingService";
import AuthContext from "../context/authContext";
import InfoContext from "../context/infoContext";
// import { date } from "yup";
// import { dateTimePickerDefaultProps } from "@material-ui/pickers/constants/prop-types";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 150,
  },
  root: {
    flexGrow: 1,
    margin: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  paper: {
    padding: 20,
    minHeight: 550,
  },
  button: {
    "margin-top": 20,
    "&:focus": {
      border: 0,
    },
  },
}));

function PlotReadings(props) {
  const [clickedAbnId, setClickedAbnId] = useState("");
  const [selectedAbn, setSelectedAbn] = useState("");

  const [date, setDate] = useState(props.searchCriteria.fromDate);
  const [status, setStatus] = useState("");
  const [confirmedEvent, setConfirmedEvent] = useState("");
  const [comment, setComment] = useState("");

  const { role } = useContext(AuthContext);
  const { eventDict } = useContext(InfoContext);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (clickedAbnId) {
      const abn = props.abnormalityRecords.find((x) => x._id === clickedAbnId);
      setSelectedAbn(abn);

      if (abn.date) setDate(abn.date);
      else setDate("");

      if (abn.status) setStatus(abn.status);
      else setStatus("");

      if (abn.confirmedEvent) setConfirmedEvent(abn.confirmedEvent);
      else setConfirmedEvent("");

      if (abn.comment) setComment(abn.comment);
      else setComment("");
    } else {
      //setDate(date);
      handleChangeDate(date)
    }
  }, [clickedAbnId, date, props, props.abnormalityRecords]);

  const classes = useStyles();

  const statusItems = Object.keys(statusDict).map((statusKey) => {
    return { label: statusDict[statusKey], value: statusKey };
  });

  const eventItems = Object.keys(eventDict).map((eventKey) => {
    return { label: eventDict[eventKey], value: eventKey };
  });

  const handleChange = (event) => {
    if (event.target.name === "status") setStatus(event.target.value);
    if (event.target.name === "event") setConfirmedEvent(event.target.value);
    if (event.target.name === "comment") setComment(event.target.value);
  };

  const handleChangeDate = (date) => {
    date = moment(date).format("YYYY-MM-DD") + "T00:00:00.000Z";
    const abnormalityRecords = [...props.abnormalityRecords];
    const dateRecord = abnormalityRecords.find((x) => x.date === date);
    if (dateRecord === undefined) {
      setSelectedAbn("");
      setClickedAbnId("");
    } else {
      setSelectedAbn(dateRecord);
      setClickedAbnId(dateRecord._id);
    }
    setDate(date);
  };

  const handleUpdate = async () => {
    const result = await updateEvent(
      clickedAbnId ? clickedAbnId : "new",
      `${props.searchCriteria.locationTag}_${props.searchCriteria.meterTag}`,
      date,
      status,
      confirmedEvent,
      comment
    );
    if (result.status === 200) {
      const updatedRecord = result.data.data;

      const abnormalityRecords = [...props.abnormalityRecords];
      const record = abnormalityRecords.find(
        (x) => x._id === updatedRecord._id
      );
      if (record === undefined) {
        abnormalityRecords.push(updatedRecord);

        abnormalityRecords.sort((a, b) => a.date.localeCompare(b.date));
      } else {
        record["date"] = updatedRecord.date;
        record["status"] = updatedRecord.status;
        record["confirmedEvent"] = updatedRecord.confirmedEvent;
        record["comment"] = updatedRecord.comment;
        record["updatedBy"] = updatedRecord.updatedBy;
      }

      props.setAbnormalityRecords(abnormalityRecords);
      props.updatePlot();

      enqueueSnackbar(`Abnormalility Record Updated.`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(
        `Abnormalility Record Cannot be Updated. Message: ${result.data.message}`,
        {
          variant: "error",
        }
      );
    }
  };

  const abnormalityRecordsToRows = (abnormalityRecords) => {
    const rows = abnormalityRecords.map((record) => {
      let row = {};
      row["date"] = record.date;
      row["status"] = record.status;
      row["classifiedEvent"] = record.classifiedEvent;
      row["confidence"] = record.confidence;
      row["confirmedEvent"] = record.confirmedEvent;
      row["updatedBy"] = record.updatedBy;
      row["_id"] = record._id;

      return row;
    });
    if (rows) return rows;
    return [];
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Paper className={classes.paper} elevation={2}>
            <CustomTextField
              classes={classes.formControl}
              label="Region"
              name="region"
              value={props.searchCriteria.region}
              fullWidth={true}
              variant="filled"
              size="small"
              readOnly={true}
            />
            <CustomTextField
              classes={classes.formControl}
              label="Location Tag"
              name="locationTag"
              value={props.searchCriteria.locationTag}
              fullWidth={true}
              variant="filled"
              size="small"
              readOnly={true}
            />
            <CustomTextField
              classes={classes.formControl}
              label="Meter Tag"
              name="meterTag"
              value={props.searchCriteria.meterTag}
              fullWidth={true}
              variant="filled"
              size="small"
              readOnly={true}
            />
            {(role === "admin" || role === "premiumuser") && (
              <>
                <CustomDatePicker
                  classes={classes.formControl}
                  label="Selected Date"
                  name="date"
                  maxDate={props.searchCriteria.toDate}
                  minDate={props.searchCriteria.fromDate}
                  value={date}
                  handleChange={handleChangeDate}
                  fullWidth={true}
                  disabled={!props.isResultFromSearch}
                  message={!props.isResultFromSearch && "Go thru Step 1 to select date arbitrarily"}
                />
                <CustomSelect
                  classes={classes.formControl}
                  label="Status"
                  name="status"
                  value={status}
                  handleChange={handleChange}
                  options={statusItems}
                  fullWidth={true}
                  size="small"
                />
                <CustomSelect
                  classes={classes.formControl}
                  label="Confirmed Event"
                  name="event"
                  value={confirmedEvent}
                  handleChange={handleChange}
                  options={eventItems}
                  fullWidth={true}
                  size="small"
                />
                <CustomTextField
                  classes={classes.formControl}
                  label="Comment"
                  name="comment"
                  value={comment}
                  handleChange={handleChange}
                  fullWidth={true}
                  multiline={true}
                  rows={5}
                  variant="outlined"
                  size="small"
                />
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  disabled={!props.isResultFromSearch && clickedAbnId === ""  }
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Paper className={classes.paper} elevation={2}>
            <TimePlot
              readings={props.readings}
              dateAndTime={props.dateAndTime}
              estimatedVol={props.estimatedVol}
              measuredVol={props.measuredVol}
              date={props.date}
              estimatedVolUpper={props.estimatedVolUpper}
              estimatedVolLow={props.estimatedVolLow}
              markers={props.markers}
              selectedMarkers={props.selectedMarkers}
              setClickedAbnId={setClickedAbnId}
              selectedAbn={selectedAbn}
              updatePlot={props.updatePlot}
            />
            <AbnormalityTable
              rows={abnormalityRecordsToRows(props.abnormalityRecords)}
              setClickedAbnId={setClickedAbnId}
              selectedAbn={selectedAbn}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default PlotReadings;
