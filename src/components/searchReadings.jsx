import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { getMeterOptions } from "../services/infoService";
import CustomSelect from "../components/common/customSelect";
import CustomDatePicker from "../components/common/customDatePicker";
import InfoContext from "../context/infoContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  paper: {
    "min-width": "60vw",
    padding: 20,
    minHeight: 550,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    alignContent: "center",
  },
  button: {
    "margin-top": 20,
  },
}));

function SearchReadings(props) {
  const [locationTagOptions, setLocationTagOptions] = useState([]);
  const [meterTagOptions, setMeterTagOptions] = useState([]);

  const [searchDisable, setSearchDisable] = useState(true);

  const { meters } = useContext(InfoContext);

  useEffect(() => {
    if (props.searchCriteria.region) {
      let lLocationTagOptions = getMeterOptions(meters).find(
        (x) => x.value === props.searchCriteria.region
      ).locationTags;
      lLocationTagOptions = lLocationTagOptions ? lLocationTagOptions : [];
      setLocationTagOptions(lLocationTagOptions);
    } else {
      setLocationTagOptions([]);
    }
  }, [props.searchCriteria.region, meters]);

  useEffect(() => {
    if (locationTagOptions.length > 0 && props.searchCriteria.locationTag) {
      let lMeterTagOptions = locationTagOptions.find(
        (x) => x.value === props.searchCriteria.locationTag
      ).meterTags;
      lMeterTagOptions = lMeterTagOptions ? lMeterTagOptions : [];
      setMeterTagOptions(lMeterTagOptions);
    } else {
      setMeterTagOptions([]);
    }
  }, [locationTagOptions, props.searchCriteria.locationTag]);

  useEffect(() => {
    let lSearchDisable = false;
    if (
      props.searchCriteria.region === "" ||
      props.searchCriteria.locationTag === "" ||
      props.searchCriteria.meterTag === "" ||
      props.searchCriteria.fromDate === "" ||
      props.searchCriteria.toDate === ""
    )
      lSearchDisable = true;

    setSearchDisable(lSearchDisable);
  }, [
    props.searchCriteria.region,
    props.searchCriteria.locationTag,
    props.searchCriteria.meterTag,
    props.searchCriteria.fromDate,
    props.searchCriteria.toDate,
  ]);

  const classes = useStyles();

  const handleChange = (event) => {
    const lsearchCriteria = { ...props.searchCriteria };

    if (event.target.name === "region") {
      lsearchCriteria["region"] = event.target.value;
      lsearchCriteria["locationTag"] = "";
      lsearchCriteria["meterTag"] = "";
    }

    if (event.target.name === "locationTag") {
      lsearchCriteria["locationTag"] = event.target.value;
      lsearchCriteria["meterTag"] = "";
    }
    if (event.target.name === "meterTag") {
      lsearchCriteria["meterTag"] = event.target.value;
    }

    props.setSearchCriteria(lsearchCriteria);
  };

  const handleDateChange = (fieldName, value) => {
    const lsearchCriteria = { ...props.searchCriteria };
    lsearchCriteria[fieldName] = value;

    props.setSearchCriteria(lsearchCriteria);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={2}>
        <Typography variant="h6" gutterBottom>
          Searching Criteria
        </Typography>
        <CustomSelect
          classes={classes.formControl}
          label="Region"
          name="region"
          value={props.searchCriteria.region}
          handleChange={handleChange}
          options={getMeterOptions(meters)}
          fullWidth={true}
        />
        <CustomSelect
          classes={classes.formControl}
          label="Location"
          name="locationTag"
          value={props.searchCriteria.locationTag}
          handleChange={handleChange}
          options={locationTagOptions}
          fullWidth={true}
        />
        <CustomSelect
          classes={classes.formControl}
          label="Meter Tag"
          name="meterTag"
          value={props.searchCriteria.meterTag}
          handleChange={handleChange}
          options={meterTagOptions}
          fullWidth={true}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CustomDatePicker
              classes={classes}
              label="From Date"
              name="fromDate"
              value={props.searchCriteria.fromDate}
              maxDate={props.searchCriteria.toDate}
              handleChange={(value) => handleDateChange("fromDate", value)}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomDatePicker
              classes={classes}
              label="To Date"
              name="toDate"
              value={props.searchCriteria.toDate}
              minDate={props.searchCriteria.fromDate}
              handleChange={(value) => handleDateChange("toDate", value)}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={props.handleSearch}
          disabled={searchDisable}
        >
          Search
        </Button>
      </Paper>
    </div>
  );
}

export default SearchReadings;
