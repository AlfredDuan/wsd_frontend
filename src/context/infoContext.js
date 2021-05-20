import React from "react";

const InfoContext = React.createContext({
  meters: [],
  setMeters: () => {},
  retrieveMetersInfo: () => {},
  selectedAbns: [],
  setSelectedAbns: () => {},
  progressOn: false,
  setProgressOn: () => {},
  eventDict: [],
  updateEventDict: () => {},
});

export default InfoContext;
