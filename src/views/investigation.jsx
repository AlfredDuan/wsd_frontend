import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import InfoContext from "../context/infoContext";

import Stepper from "../components/stepper";

import SearchReadings from "../components/searchReadings";
import PlotReadings from "../components/plotReadings";
import NoRecord from "../components/common/noRecord";

import { retrieveData } from "../utils/investigation";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 150,
  },
  root: {
    flexGrow: 1,
    margin: 20,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  commentBox: {
    width: 320,
  },
}));

function Investigation(props) {
  const [activeStep, setActiveStep] = useState(0);
  const [searchCriteria, setSearchCriteria] = useState({
    region: "",
    locationTag: "",
    meterTag: "",
    fromDate: new Date("01/01/2018"),
    toDate: new Date(),
  });

  const [readings, setReadings] = useState([]);
  const [dateAndTime, setDateAndTime] = useState([]);
  const [estimatedVol, setEstimatedVol] = useState([]);
  const [measuredVol, setMeasuredVol] = useState([]);
  const [date, setDate] = useState([]);
  const [estimatedVolUpper, setEstimatedVolUpper] = useState([]);
  const [estimatedVolLow, setEstimatedVolLow] = useState([]);
  const [markers, setMarkers] = useState();
  const [selectedMarkers, setSelectedMarkers] = useState([]);
  const [abnormalityRecords, setAbnormalityRecords] = useState([]);
  const { selectedAbns, progressOn, setProgressOn } = useContext(InfoContext);
  const [isResultFromSearch, setIsResultFromSearch] = useState(false);


  useEffect(() => {
    const initData = async (lSearchCriteria, selectedAbns) => {
      const {
        readings: lReadings,
        dateAndTime: lDateAndTime,
        estimatedVol: lEstimatedVol,
        measuredVol: lMeasuredVol,
        date: lDate,
        estimatedVolUpper: lEstimatedVolUpper,
        estimatedVolLow: lEstimatedVolLow,
        abnormalityRecords: lAbnormalityRecords,
        markers,
        selectedMarkers,
      } = await retrieveData(lSearchCriteria, selectedAbns);

      setReadings(lReadings);
      setDateAndTime(lDateAndTime);
      setEstimatedVol(lEstimatedVol);
      setMeasuredVol(lMeasuredVol);
      setDate(lDate);
      setEstimatedVolUpper(lEstimatedVolUpper);
      setEstimatedVolLow(lEstimatedVolLow);
      setAbnormalityRecords(lAbnormalityRecords);
      setMarkers(markers);
      setSelectedMarkers(selectedMarkers);
      setProgressOn(false);
    };
    const renderSelectedAbns =
      props.location.state && props.location.state.renderSelectedAbns;

    if (renderSelectedAbns) {
      const infos = selectedAbns[0].split("%");
      const region = infos[1];
      const locationTag = infos[2];
      const meterTag = infos[3];

      const sortedAbn = selectedAbns.sort((a, b) => {
        const adate = Date.parse(a.split("%")[0]);
        const bdate = Date.parse(b.split("%")[0]);

        if (adate < bdate) return -1;
        if (adate > bdate) return 1;
        return 0;
      });

      const toDate = sortedAbn[sortedAbn.length - 1].split("%")[0];
      const fromDate = sortedAbn[0].split("%")[0];
      const lSearchCriteria = {
        region,
        locationTag,
        meterTag,
        fromDate,
        toDate,
      };
      setSearchCriteria(lSearchCriteria);

      setProgressOn(true);
      setActiveStep(1);

      initData(lSearchCriteria, selectedAbns);
    }
  }, [
    props.location.state,
    selectedAbns,
    setProgressOn,
    // markers,
    // selectedMarkers,
  ]);

  const classes = useStyles();

  const handleSearch = async () => {
    await updatePlot()
    setIsResultFromSearch(true)
  }

  const updatePlot = async () => {
    setProgressOn(true);
    setActiveStep(1);

    const {
      readings: lReadings,
      dateAndTime: lDateAndTime,
      estimatedVol: lEstimatedVol,
      measuredVol: lMeasuredVol,
      date: lDate,
      estimatedVolUpper: lEstimatedVolUpper,
      estimatedVolLow: lEstimatedVolLow,
      abnormalityRecords: lAbnormalityRecords,
      markers,
      selectedMarkers,
    } = await retrieveData(searchCriteria);

    setReadings(lReadings);
    setDateAndTime(lDateAndTime);
    setEstimatedVol(lEstimatedVol);
    setMeasuredVol(lMeasuredVol);
    setDate(lDate);
    setEstimatedVolUpper(lEstimatedVolUpper);
    setEstimatedVolLow(lEstimatedVolLow);
    setAbnormalityRecords(lAbnormalityRecords);
    setMarkers(markers);
    setSelectedMarkers(selectedMarkers);
    setProgressOn(false);
  };

  return (
    <div className={classes.root}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} sm={8}>
          <Stepper activeStep={activeStep} handleStep={setActiveStep} />
        </Grid>
        <Grid item xs={12} sm={12}>
          {activeStep === 0 && (
            <SearchReadings
              searchCriteria={searchCriteria}
              setSearchCriteria={setSearchCriteria}
              handleSearch={handleSearch}
            />
          )}
          {activeStep === 1 && readings.length > 0 && (
            <PlotReadings
              searchCriteria={searchCriteria}
              readings={readings}
              dateAndTime={dateAndTime}
              estimatedVol={estimatedVol}
              measuredVol={measuredVol}
              date={date}
              estimatedVolUpper={estimatedVolUpper}
              estimatedVolLow={estimatedVolLow}
              markers={markers}
              selectedMarkers={selectedMarkers}
              abnormalityRecords={abnormalityRecords}
              setAbnormalityRecords={setAbnormalityRecords}
              updatePlot={updatePlot}
              isResultFromSearch = {isResultFromSearch}
            />
          )}
          {!progressOn &&
            activeStep === 1 &&
            readings.length === 0 && <NoRecord />}
        </Grid>
      </Grid>
    </div>
  );
}

export default Investigation;
