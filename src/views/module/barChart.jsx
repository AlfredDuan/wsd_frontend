import React, { useRef, useEffect } from 'react';
import { Paper } from '@material-ui/core';
import Plotly from 'plotly.js';
export default function (props) {
  const data = props.data.originData;
  console.log(data, 'barchart data');
  const chatContainer = useRef(null);
  useEffect(() => {
    console.log(chatContainer);
    let y = [],
      x = [],
      chartData = [];
    // data.forEach((item) => {
    //   x.push(item.date);
    // });
    // data.forEach((item) => {
    //   chartData.push({
    //     x,
    //     y: [item.typeVal],
    //     name: item.typeName,
    //     type: 'bar',
    //   });
    // });
    var trace1 = {
      x: ['2', '3', '4'],
      y: [20, 14, 23],
      name: 'SF Zoo',
      type: 'bar',
    };

    var trace2 = {
      x: ['2', '3','4','5'],
      y: [12, 0,18],
      name: 'SF Zoo',
      type: 'bar',
    };

    var data = [trace1, trace2];

    var layout = { barmode: 'stack',title: 'Number of Caese in Region HKI' };

    Plotly.newPlot(chatContainer.current, data, layout);
  }, []);
  return (
    <Paper style={{ padding: '30px' }}>
      <div ref={chatContainer} style={props.style}></div>
    </Paper>
  );
}
