import moment from "moment";
// import get from "lodash/get";

import { getCleanReadingsFlatten, getRawReadings, getAbnormalities } from "../services/readingService";
import { dateToStr, checkClassifiedEvent } from "./helpers";
import {noDataThreshold, volZValue} from "../config.json"

function isNeighbor(day1, day2) {
  const timestamp1 = Date.parse(day1);
  const timestamp2 = Date.parse(day2);
  const oneDayMs = 24 * 60 * 60 * 1000;
  const duration = timestamp2 - timestamp1;

  const isBeforeOneDay = duration === -oneDayMs;
  const isAfterOneDay = duration === oneDayMs;

  return isBeforeOneDay || isAfterOneDay;
}

export const retrievePlotData = async (
  locationTag_meterTag,
  fromDate,
  toDate
) => {
  const {data: cleanReadingsFlatten} = await getCleanReadingsFlatten(locationTag_meterTag, fromDate, toDate);
  const {data: rawReadings} = await getRawReadings(locationTag_meterTag, fromDate, toDate);

  let readings = [];
  let dateAndTime = [];
  let estimatedVol = [];
  let estimatedVolUpper = [];
  let estimatedVolLow = [];
  let measuredVol = [];
  let date = [];
  let j = 0;


  readings = cleanReadingsFlatten.readings
  dateAndTime = cleanReadingsFlatten.dateAndTime
  date = cleanReadingsFlatten.date



  // for (let doc of cleanReadings) {
  //   readings = readings.concat(doc.readings);
  //   // readings = [...readings,doc.readings]
  //   dateAndTime = dateAndTime.concat(doc.dateAndTime);
  //   const dateOri = moment(doc.date).format("YYYY-MM-DD") + " 00:00:00";
  //   date = date.concat(dateOri);
  // }
  // console.log(rawReadings)
  
  for (var i = 0; i < date.length; i++){
    console.log(moment(date[i]).format('YYYY-MM-DD'))
    console.log(moment(rawReadings.data[j].date).format('YYYY-MM-DD'))
    if (moment(date[i]).format('YYYY-MM-DD') === moment(rawReadings.data[j].date).format('YYYY-MM-DD')) {
      measuredVol = measuredVol.concat(rawReadings.data[j].measuredVol);
      if (isNaN(rawReadings.data[j].estimatedVol)){
        estimatedVol = estimatedVol.concat(0);
        estimatedVolUpper = estimatedVolUpper.concat(0);
        estimatedVolLow = estimatedVolLow.concat(0);
      } else {
        estimatedVol = estimatedVol.concat(rawReadings.data[j].estimatedVol);
        estimatedVolUpper = estimatedVolUpper.concat(rawReadings.data[j].estimatedVol + volZValue * Math.sqrt(rawReadings.data[j].estimatedVolVar));
        if (rawReadings.data[j].estimatedVol - volZValue * Math.sqrt(rawReadings.data[j].estimatedVolVar) > 0) {
          estimatedVolLow = estimatedVolLow.concat(rawReadings.data[j].estimatedVol - volZValue * Math.sqrt(rawReadings.data[j].estimatedVolVar));
        } else {
          estimatedVolLow = estimatedVolLow.concat(0);
        }
      }
      if (j < rawReadings.data.length){
        j++
      }
    } else {
      measuredVol = measuredVol.concat(null)
      estimatedVol = estimatedVol.concat(0);
      estimatedVolUpper = estimatedVolUpper.concat(0);
      estimatedVolLow = estimatedVolLow.concat(0);
    }
  }
  console.log(locationTag_meterTag)
  console.log(j)
  console.log(rawReadings.data.length)
  console.log(date.length)
  console.log(measuredVol)
  console.log(estimatedVolUpper)
  console.log(estimatedVolLow)
  // for (let doc of rawReadings.data) {
  //   if (isNaN(doc.estimatedVol) || doc.estimatedVol === []){
  //     estimatedVol.concat(0);
  //     estimatedVolUpper.concat(0);
  //     estimatedVolLow.concat(0);
  //   } else {
  //     estimatedVol = estimatedVol.concat(doc.estimatedVol);
  //     estimatedVolUpper = estimatedVolUpper.concat(doc.estimatedVol + volZValue * Math.sqrt(doc.estimatedVolVar));
  //     if (doc.estimatedVol - volZValue * Math.sqrt(doc.estimatedVolVar) > 0){
  //       estimatedVolLow = estimatedVolLow.concat(doc.estimatedVol - volZValue * Math.sqrt(doc.estimatedVolVar));
  //     } else {
  //       estimatedVolLow = estimatedVolLow.concat(0);
  //     }
  //   }
  //   if (doc.estimatedVol === []) {
  //     measuredVol = measuredVol.concat(0);
  //   } else {
  //     measuredVol = measuredVol.concat(doc.measuredVol);
  //   }
    // measuredVol = measuredVol.concat(doc.measuredVol);
  // }

  return { readings, dateAndTime, estimatedVol, measuredVol, date , estimatedVolUpper, estimatedVolLow};
};

export const retrieveMarkers = async (
  locationTag_meterTag,
  status,
  fromDate,
  toDate,
  readings,
  dateAndTime
) => {
  const { data } = await getAbnormalities({
    locationTag_meterTag,
    status,
    fromDate,
    toDate,
  });
  let abnormalityRecords = data.data;
  let eventMarkers = {};
  for (let doc of abnormalityRecords) {
    const classifiedEvent = checkClassifiedEvent(
      doc.classifiedCluster
    );
    doc["classifiedEvent"] = classifiedEvent;
    const dateStr = dateToStr(doc.date);
    const xIndex = dateAndTime.findIndex((x) => x === dateStr);
    if (xIndex === -1) {
      console.log("Error: The date cannot be found from DateTime. ", dateStr);
    } else {
      const reading = readings[xIndex];

      if (eventMarkers[classifiedEvent]) {
        eventMarkers[classifiedEvent].x.push(dateStr);
        eventMarkers[classifiedEvent].y.push(reading);
        eventMarkers[classifiedEvent]._id.push(doc._id);
      } else {
        eventMarkers[classifiedEvent] = {
          x: [dateStr],
          y: [reading],
          _id: [doc._id],
          type: "scatter",
          mode: "markers",
          name: classifiedEvent,
          classifiedEvent: classifiedEvent,
          hovermode: "closest",
          hoverinfo: "x",
        };
      }
    }
  }

  const markers = Object.values(eventMarkers);
  // console.log("markers", markers);
  // console.log("abnormalityRecords", abnormalityRecords);
  return { abnormalityRecords, markers };
};

export const genConsecutiveNoData = (
  lReadings,
  lDateAndTime,
) => {
  let nullCount = 0
  let threshold = noDataThreshold
  let nullFoundIndex = []
  for(let i = 0; i < lReadings.length; i=i+96) { // skip next 95 data which happened in a single day
    if(lReadings[i] === null) {
      nullCount = nullCount + 1
      if (nullCount === threshold)
        nullFoundIndex.push(i)
    }else {
      nullCount = 0
    }
  }
  let x = []
  let y = []
  for(let index of nullFoundIndex){
    x.push(lDateAndTime[index - (threshold) * 96])
    y.push(lReadings[index - (threshold) * 96])
  }

  return { consecutiveNoData: { x, y} }
}

export const genAbnormalityTrace = (
  AbnormalityDate,
  lReadings,
  lDateAndTime,
  classifiedEvent,
  markers
) => {
  const annotations = [];
  const consecutiveEvents = {};
  let trace = {
    x: [],
    y: [],
    type: "scatter",
    name: "Event Trace",
    hoverinfo: "skip",
    line: { color: "red", dash: "dashdot", width: 4 },
  };

  let abnormalityDateTime;
  if (AbnormalityDate) {
    abnormalityDateTime =
      moment(AbnormalityDate).format("YYYY-MM-DD") + " 00:00:00";
    const samplesPerDay = classifiedEvent === "crossDaysError" ? 192 : 96;

    const index = lDateAndTime.findIndex((x) => x === abnormalityDateTime);
    const readings = lReadings.slice(index, index + samplesPerDay);
    const dateAndTime = lDateAndTime.slice(index, index + samplesPerDay);

    annotations.push({
      x: dateAndTime[0],
      y: readings[0],
      xref: "x",
      yref: "y",
      text: "Selected Event",
      showarrow: true,
      arrowhead: 3,
      ax: -20,
      ay: -30,
    });

    trace.x = dateAndTime;
    trace.y = readings;
  }

  if (markers && markers.length > 0) {
    const ans = [];
    let xArray = [];
    let yArray = [];
    for (let i = 0; i < markers.length; i++) {
      xArray = xArray.concat(markers[i].x);
      yArray = yArray.concat(markers[i].y);
    }

    const xyMapper = xArray.map((x, index) => {
      return {
        x,
        y: yArray[index],
      };
    });
    xyMapper.sort((a, b) => a.x.localeCompare(b.x));
    xArray = Array.from(xyMapper.values()).map((xy) => xy.x);

    let acc = 0;
    let xIndex = 0;
    for (; xIndex < xArray.length; xIndex++) {
      const x = xArray[xIndex];
      const previousX = xArray[xIndex - 1];
      if (xIndex === 0 || isNeighbor(x, previousX)) {
        acc++;
      } else {
        if (acc >= 3) {
          const continuouslyDates = Array.from({ length: acc }).map(
            // eslint-disable-next-line no-loop-func
            (_, index) => xIndex - acc + index
          );
          ans.push(continuouslyDates);
        }
        acc = 1;
      }
    }

    if (acc >= 3) {
      const continuouslyDates = Array.from({ length: acc }).map(
        (_, index) => xIndex - acc + index
      );
      ans.push(continuouslyDates);
    }

    consecutiveEvents.x = ans.reduce((accumulator, currentNumber) => {
        accumulator.push(xyMapper[currentNumber[0]].x);
        return accumulator
      } , []);
    consecutiveEvents.y = ans.reduce((accumulator, currentNumber) => {
        accumulator.push(xyMapper[currentNumber[0]].y);
        return accumulator
      } , []);
    
    // const consecutiveAnnotations = ans.map((group) => {
    //   let arrowIndex = group[0];
      // return {
      //   x: xyMapper[arrowIndex].x,
      //   y: xyMapper[arrowIndex].y,
      //   xref: "x",
      //   yref: "y",
      //   text: " Consecutive Event ",
      //   showarrow: true,
      //   arrowhead: 3,
      //   arrowcolor: "rgb(51 95 63)",
      //   font: {
      //     // family: "Courier New, monospace",
      //     size: 12,
      //     color: "rgb(51 95 63)",
      //   },
      //   ax: -10,
      //   ay: 30,
      // };
    // });
    // console.log("consecutiveAnnotations: ", consecutiveAnnotations)
    // annotations.push(...consecutiveAnnotations);

    if (AbnormalityDate) {
      out: for (let group of ans) {
        for (let xIndex of group) {
          if (abnormalityDateTime === xyMapper[xIndex].x) {
            trace.x = group.map((i) => xyMapper[i].x);
            trace.y = group.map((i) => xyMapper[i].y);
            break out;
          }
        }
      }
    }
  }

  return { trace, annotations, consecutiveEvents };
};
