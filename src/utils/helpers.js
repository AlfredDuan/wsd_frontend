export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const statusDict = {
  toClassify: "To be classified",
  newFound: "New Found",
  confirmed: "Confirmed",
  unsure: "Unsure",
};

// export const eventDict = {
//   crossDaysError: "Cross Days Error",
//   leakage: "Leakage",
//   maintenance: "Maintenance",
//   meterReset: "Meter Reset",
//   accident: "Accident",
//   others: "Others",
//   unknown: "Unknown",
// };

export function checkClassifiedEvent(classifiedCluster) {
  // console.log("classifiedCluster: ", classifiedCluster)
  let events = JSON.parse(window.localStorage.getItem("eventType"));
  // console.log("events: ", events)

  if (classifiedCluster === 0) return "crossDaysError";
  if (!classifiedCluster) return "unknown";

  const event = events[classifiedCluster];
  // console.log("event: ", event)


  if (!event) return "unknown";
  // console.log("event.eventTag: ", event.eventTag)

  return event.eventTag;
}

export function dateToStr(date) {
  return `${date.substring(0, 10)} 00:00:00`;
}

export function filterMarkersFromAbns(
  markers,
  abnormalityRecords,
  selectedAbns
) {
  const dateList = selectedAbns.reduce((dateList, x) => {
    dateList.push(x.split("%")[0]);
    return dateList;
  }, []);

  const filteredMarkers = markers
    .map((marker) => {
      const temp_x = [];
      const temp_y = [];
      const temp_id = [];

      for (let index in marker.x) {
        if (dateList.includes(marker.x[index].substring(0, 10))) {
          temp_x.push(marker.x[index]);
          temp_y.push(marker.y[index]);
          temp_id.push(marker._id[index]);
        }
      }
      marker.x = temp_x;
      marker.y = temp_y;
      marker._id = temp_id;

      return marker;
    })
    .filter((marker) => marker.x.length > 0);

  const filteredAbnormalityRecords = abnormalityRecords.filter((x) =>
    dateList.includes(x.date.substring(0, 10))
  );

  return {
    filteredMarkers,
    filteredAbnormalityRecords,
  };
}
