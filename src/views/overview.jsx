import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Divider, Box } from '@material-ui/core/';
import HomeTable from '../components/homeTable';
import Button from '@material-ui/core/Button';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import InfoContext from '../context/infoContext';
import { getAbnormalities } from '../services/readingService';
import { checkClassifiedEvent } from '../utils/helpers';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  timeTable: {
    width: '80%',
    height: 90,
    marginTop: 70,
    display: 'flex',
    alignItems: 'center',
    // justifyContent: "space-between",
    padding: '0 50px',
  },
  'date-ipt': {
    margin: '0 50px',
  },
  card: {
    width: '17%',
    height: 320,
    margin: 10,
    '& .divider': {
      height: 2,
    },
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paper: {
    'min-width': '60vw',
    margin: 30,
    padding: 20,
    minHeight: 200,
  },
  'title-tag': {
    height: 60,
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    padding: '10px 15px',
    '& .button': {
      margin: 0,
    },
    '&>span': {
      fontSize: 20,
      fontWeight: 400,
    },
  },
  'list-content': {
    padding: 10,
    marginBottom: 5,
    '& ul li': {
      padding: '5px 0',
    },
  },
  'graph-button': {
    padding : 10,
    marginBottom : '10px'
  },
  page: {
    'min-width': '10vw',
    margin: 30,
    padding: 20,
    minHeight: 300,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    alignContent: 'center',
  },
  button: {
    marginRight: '20px',
  },
}));
const sendData = {
  locationTag_meterTag: 'demo_location_DemoMeter1',
  fromDate: '',
  toDate: '',
  status: 'newFound',
};
const localDemo = ['demo_location_DemoMeter1'];
export default function Home() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const { selectedAbns } = useContext(InfoContext);
  const [fromDate, setFromDate] = useState(
    moment('2017-04-11').format('YYYY-MM-DD') + 'T00:00:00.000Z'
  ); //set up a defualt time 
  const [toDate, setToDate] = useState(
    moment().format('YYYY-MM-DD') + 'T00:00:00.000Z'
  ); //set a defualt time
  const handleDateChange = (value, type) => {
    let date = moment(value).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    if (type === 'from') {
      setFromDate(date);
    } else {
      setToDate(date);
    }
  };
  const search = '?selectedAbns=1';
  const [listData, setListData] = useState([]);
  if (redirect === true)
    return (
      <Redirect
        to={{
          pathname: '/investigation',
          search: search,
          state: { renderSelectedAbns: true },
        }}
      />
    );
  useEffect(() => {
    sendData.fromDate = fromDate;
    sendData.toDate = toDate;
    getAbnormalities(sendData).then((res) => {
      let {data} = res.data;
      if (data) {
        let val = data.map((item) => {
          return checkClassifiedEvent(item.classifiedCluster);
        });
        setListData(val);
      }
    });
  }, [fromDate, toDate]);
  return (
    <div>
      <div className={classes.container}>
        <Paper className={classes.timeTable} elevation={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div>
              <DatePicker
                label="From Date"
                value={fromDate}
                format="yyyy-MM-dd"
                onChange={(e) => handleDateChange(e, 'from')}
                animateYearScrolling
              />
            </div>
            <div>
              <DatePicker
                className={classes['date-ipt']}
                label="To Date"
                value={toDate}
                format="yyyy-MM-dd"
                onChange={(e) => handleDateChange(e, 'to')}
                animateYearScrolling
              />
            </div>
            {/* <div className={classes["date-ipt"]}>
              <TextField
                id="standard-required"
                label="To Date"
                defaultValue={toDate}
              />
            </div> */}
          </MuiPickersUtilsProvider>

          <div>
            <Button
              className={classes.button}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setRedirect(true)}
              startIcon={<ShowChartIcon />}
            >
              PLOT CASES
            </Button>
            <Button
              className={classes.button}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setRedirect(true)}
              startIcon={<ShowChartIcon />}
            >
              RESET
            </Button>
          </div>
        </Paper>
      </div>
      <div style={{ marginTop: '50px' }} className={classes.container}>
        <Paper className={classes.card} elevation={2}>
          <div className={classes['title-tag']}>
            <span>tag</span>
            <Button
              className="button"
              size="small"
              variant="contained"
              color="primary"
              disabled={selectedAbns.length === 0}
              onClick={() => setRedirect(true)}
              startIcon={<ShowChartIcon />}
            >
              Details
            </Button>
          </div>
          <Divider className="divider"></Divider>
          <div className={classes['list-content']}>
            <div className="content-title">
              <b>No of Caese: {listData.length}</b>
            </div>
            <Box>
              <ul>
                {listData.map((item) => {
                  return (
                    <li key={item}>
                      <span>-</span>
                      <span>{item} ({item.length})</span>
                    </li>
                  );
                })}
              </ul>
            </Box>
          </div>
          <div className="graph-button">
            <Button
              className="button"
              size="small"
              variant="contained"
              color="primary"
              disabled={selectedAbns.length === 0}
              onClick={() => setRedirect(true)}
              startIcon={<ShowChartIcon />}
            >
              GRAPH
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );

  //   return (
  //     <div className={classes.root}>
  //       <Paper className={classes.paper} elevation={2}>
  //         <Button
  //           className={classes.button}
  //           size="small"
  //           variant="contained"
  //           color="primary"
  //           disabled={selectedAbns.length === 0}
  //           onClick={() => setRedirect(true)}
  //           startIcon={<ShowChartIcon />}
  //         >
  //           Details
  //         </Button>

  //       </Paper>
  //       <Paper className={classes.page} elevation={2}>HKI<Button
  //           className={classes.button}
  //           size="small"
  //           variant="contained"
  //           color="primary"

  //           onClick={() => setRedirect(true)}
  //           startIcon={<ShowChartIcon />}
  //         >
  //           Details
  //         </Button></Paper>
  //       <Paper className={classes.page} elevation={2}>KLN<Button
  //           className={classes.button}
  //           size="small"
  //           variant="contained"
  //           color="primary"

  //           onClick={() => setRedirect(true)}
  //           startIcon={<ShowChartIcon />}
  //         >
  //           Details
  //         </Button></Paper>
  //       <Paper className={classes.page} elevation={2}>NTE1<Button
  //           className={classes.button}
  //           size="small"
  //           variant="contained"
  //           color="primary"

  //           onClick={() => setRedirect(true)}
  //           startIcon={<ShowChartIcon />}
  //         >
  //           Details
  //         </Button></Paper>
  //       <Paper className={classes.page} elevation={2}>NTE2<Button
  //           className={classes.button}
  //           size="small"
  //           variant="contained"
  //           color="primary"

  //           onClick={() => setRedirect(true)}
  //           startIcon={<ShowChartIcon />}
  //         >
  //           Details
  //         </Button></Paper>
  //       <Paper className={classes.page} elevation={2}>NTW<Button
  //           className={classes.button}
  //           size="small"
  //           variant="contained"
  //           color="primary"

  //           onClick={() => setRedirect(true)}
  //           startIcon={<ShowChartIcon />}
  //         >
  //           Details
  //         </Button></Paper>
  //     </div>
  //   );
}
