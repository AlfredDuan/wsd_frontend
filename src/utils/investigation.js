import { retrievePlotData, retrieveMarkers } from "./timePlot";
import { filterMarkersFromAbns } from "./helpers";

export async function retrieveData(searchCriteria, selectedAbns = null) {
  const locationTag_meterTag = `${searchCriteria.locationTag}_${searchCriteria.meterTag}`;
  const fromDate = searchCriteria.fromDate;
  const toDate = searchCriteria.toDate;
  const status = null;

  const {
    readings,
    dateAndTime,
    estimatedVol,
    measuredVol,
    date,
    estimatedVolUpper,
    estimatedVolLow,
  } = await retrievePlotData(locationTag_meterTag, fromDate, toDate);

  let { abnormalityRecords, markers } = await retrieveMarkers(
    locationTag_meterTag,
    status,
    fromDate,
    toDate,
    readings,
    dateAndTime
  );
  let selectedMarkers = markers;
  if (selectedAbns) {
    const {
      filteredMarkers,
      filteredAbnormalityRecords,
    } = filterMarkersFromAbns(markers, abnormalityRecords, selectedAbns);

    abnormalityRecords = filteredAbnormalityRecords;
    selectedMarkers = filteredMarkers;
  }

  return {
    readings,
    dateAndTime,
    estimatedVol,
    measuredVol,
    date,
    estimatedVolUpper,
    estimatedVolLow,
    abnormalityRecords,
    markers,
    selectedMarkers,
  };
}
