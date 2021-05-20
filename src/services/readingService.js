import http from "./httpService";
import qs from "qs";

export function getCleanReadingsFlatten(locationTag_meterTag, fromDate, toDate) {
  const query = {};
  if (fromDate) query["fromdate"] = fromDate;
  if (toDate) query["todate"] = toDate;

  const quertStr = qs.stringify(query).toLowerCase();
  return http.get(
    `/clean-readings-flatten/${locationTag_meterTag}?${quertStr}`
  );
}

export function getRawReadings(locationTag_meterTag, fromDate, toDate) {
  const query = {};
  if (fromDate) query["fromdate"] = fromDate;
  if (toDate) query["todate"] = toDate;

  const quertStr = qs.stringify(query).toLowerCase();
  return  http.get(
    `/raw-readings/${locationTag_meterTag}?${quertStr}`
  );
}

export function getAbnormalities({
  locationTag_meterTag,
  status,
  fromDate,
  toDate,
}) {
  const query = {};
  if (locationTag_meterTag)
    query["locationTag_meterTag"] = locationTag_meterTag;
  if (status) query["status"] = status;
  if (fromDate) query["fromdate"] = fromDate;
  if (toDate) query["todate"] = toDate;

  const quertStr = qs.stringify(query);
  return http.get(`/abnormalities?${quertStr}`);
}

export function getFileList(folder) {
  return http.get(`/raw-readings/csv-files/${folder}`);
}

export function importCSVFiles(folderPath, fileList, overwrite) {
  return http.post(`/raw-readings`, {
    folderPath,
    fileList,
    overwrite,
  });
}

export function updateEvent(
  id,
  locationTag_meterTag,
  date,
  status,
  confirmedEvent,
  comment
) {
  return http.put(`/abnormality/${id}`, {
    locationTag_meterTag,
    date,
    status,
    confirmedEvent,
    comment,
  });
}
