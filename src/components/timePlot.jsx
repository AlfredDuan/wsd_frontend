import React, { useState, useEffect, useContext } from "react";
import Plot from "react-plotly.js";
import Box from "@material-ui/core/Box";

import { genAbnormalityTrace, genConsecutiveNoData } from "../utils/timePlot";
import InfoContext from "../context/infoContext";
import { noDataThreshold } from "../config.json";

// import { rgbToHex } from "@material-ui/core";

const TimePlot = ({
  readings,
  dateAndTime,
  estimatedVol,
  measuredVol,
  date,
  estimatedVolUpper,
  estimatedVolLow,
  markers,
  selectedMarkers,
  setClickedAbnId,
  selectedAbn,
}) => {
  const [dragLayer, setDragLayer] = useState();
  const [selectedTrace, setSelectedTrace] = useState({});
  const [selectedAnnotations, setSelectedAnnotations] = useState([]);
  const [consecutiveEvents, setConsecutiveEvents] = useState({});
  const [consecutiveNoData, setConsecutiveNoData] = useState({});
  const [volText, setVolText] = useState({});

  const [xaxis, setXaxis] = useState({});
  const [yaxis, setYaxis] = useState({});
  const [yaxis2, setYaxis2] = useState({});

  const { eventDict } = useContext(InfoContext);

  useEffect(() => {
    setDragLayer(document.getElementsByClassName("nsewdrag"));
  }, []);

  useEffect(() => {
    const { trace, annotations, consecutiveEvents } = genAbnormalityTrace(
      selectedAbn && selectedAbn.date,
      readings,
      dateAndTime,
      selectedAbn && selectedAbn.classifiedEvent,
      markers
    );
    setSelectedTrace(trace);
    setSelectedAnnotations(annotations);
    setConsecutiveEvents(consecutiveEvents);
  }, [
    selectedAbn,
    readings,
    dateAndTime,
    estimatedVol,
    measuredVol,
    date,
    estimatedVolUpper,
    estimatedVolLow,
    markers,
  ]);

  useEffect(() => {
    setDragLayer(document.getElementsByClassName("nsewdrag"));
  }, []);

  useEffect(() => {
    let volText = []
    for(let i=0; i<estimatedVolUpper.length; i++){
      volText.push(`Est. Up: ${Math.round(estimatedVolUpper[i])} <br>Est. Low: ${Math.round(estimatedVolLow[i]) }`)
    }
    setVolText(volText)

  }, [
    estimatedVolUpper,
    estimatedVolLow,
  ]);


  useEffect(() => {
    const { consecutiveNoData } = genConsecutiveNoData(
      readings,
      dateAndTime,
    );
    setConsecutiveNoData(consecutiveNoData);
  }, [
    readings,
    dateAndTime,
  ]);

  const updatedMarkers = selectedMarkers.map((m) => {
    const name = m.name;
    m.name = eventDict[name] === undefined ? m.name : eventDict[name];
    return m;
  });

  const handleClickOnMarker = (point) => {
    console.log("handleClickOnMarker, point: ", point)
    const pointIndex = point.pointIndex;
    const _id = point.data._id[pointIndex];
    setClickedAbnId(_id);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Plot
        data={[
          {
            x: dateAndTime,
            y: readings,
            mode: "lines",
            type: "scatter",
            name: "readings",
            legendgroup: "left",
            hoverinfo: "skip",
          },
          // {
          //   x: date,
          //   y: estimatedVol,
          //   yaxis: "y2",
          //   mode: 'lines',
          //   line: {
          //     dash: 'dot',
          //     width: 4
          //   },
          //   name: "estimatedVol",
          //   legendgroup: "volume",
          //   opacity: 0.6,
          //   marker: {
          //     color: "green",
          //   },
          // },
          {
            x: date,
            y: estimatedVolUpper,
            yaxis: "y2",
            fill: 'none',
            mode: 'line',
            type: 'scatter',
            line: {
              dash: 'dot',
              width: 0.5
            },
            name: "estimatedVolUpper",
            legendgroup: "volume",
            opacity: 0.4,
            marker: {
              color: "green",
            },
            hoverinfo: "skip",
          },
          {
            x: date,
            y: estimatedVolLow,
            yaxis: "y2",
            fill: 'tonexty',
            mode: 'line',
            type: 'scatter',
            line: {
              dash: 'dot',
              width: 1
            },
            name: "estimatedVolLow",
            legendgroup: "volume",
            opacity: 0.4,
            marker: {
              color: "green",
            },
            hoverinfo: "skip",
          },
          {
            x: date,
            y: measuredVol,
            yaxis: "y2",
            mode: 'lines',
            line: {
              dash: 'solid',
              width: 4
            },
            name: "measuredVol",
            legendgroup: "volume",
            opacity: 0.6,
            marker: {
              color: "red",
            },
            text: volText,
          },
          {
            x: consecutiveEvents.x,
            y: consecutiveEvents.y,
            mode: 'markers',
            type: 'scatter',
            name: 'Consecutive Event',
            marker: { symbol: 'x-dot',size: 12 },
            hoverinfo: "skip",
          },
          {
            x: consecutiveNoData.x,
            y: consecutiveNoData.y,
            mode: 'markers',
            type: 'scatter',
            name: `No data > ${noDataThreshold} days`,
            marker: { symbol: 'triangle-up-dot',size: 12 },
            hoverinfo: "skip",
          },
          ...updatedMarkers,
          selectedTrace,
        ]}
        style={{ width: "70vw", height: "60vh" }}
        layout={{
          title: "Flow Meter Readings and Abnormality Records",
          titlefont: {
            size: 14,
          },
          hovermode:'closest',
          colorbar: "red",
          showlegend: true,
          legend: {
            bgcolor: "transparent",
            x: 1.07,
            y: 1,
          },
          orientation: "h",
          // autosize: false,
          margin: {
            l: 60,
            r: 80,
            b: 40,
            t: 30,
            pad: 4,
          },

          dragmode: "pan",
          barmode: "group",
          xaxis: { ...xaxis },
          yaxis: { ...yaxis, overlaying: "y2" },
          yaxis2: {
            ...yaxis2,
            side: "right",
          },
          annotations: [...selectedAnnotations],
        }}
        config={{
          displayModeBar: false,
          scrollZoom: true,
          responsive: true,
        }}
        onClick={(data) => {
          let points = data.points.filter(point => point.data.type === "scatter" && point.fullData.name !== 'measuredVol')
          if(points.length > 0)
            handleClickOnMarker(points[0]);
        }}
        onHover={(data) => {
          dragLayer[0].style.cursor = "pointer";
        }}
        onUnhover={(data) => {
          dragLayer[0].style.cursor = "";
        }}
        onRelayout={function (data) {
          setXaxis({ range: [data["xaxis.range[0]"], data["xaxis.range[1]"]] });
          setYaxis({
            range: [data["yaxis.range[0]"], data["yaxis.range[1]"]],
          });
          setYaxis2({
            range: [data["yaxis2.range[0]"], data["yaxis2.range[1]"]],
          });
        }}
      />
    </Box>
  );
};

export default TimePlot;
