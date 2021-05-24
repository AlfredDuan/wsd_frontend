import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Divider, Box, withStyles, Modal } from '@material-ui/core/';
import HomeTable from '../components/homeTable';
import Button from '@material-ui/core/Button';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import InfoContext from '../context/infoContext';
import { getAbnormalities } from '../services/readingService';
import { checkClassifiedEvent } from '../utils/helpers';
import { getMeterInfo } from '../utils/info';
//import the chart module
import BarChart from './module/barChart';
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

const styles = {
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
  page: {
    'min-width': '10vw',
    margin: 30,
    padding: 20,
    minHeight: 300,
  },
  formControl: {
    margin: 4,
    minWidth: 200,
    alignContent: 'center',
  },
  button: {
    marginRight: '20px',
  },
};

const sendData = {
  // locationTag_meterTag: 'demo_location_DemoMeter1',
  fromDate: '',
  toDate: '',
  status: 'newFound',
};
const GenerateItem = (props) => {
  const classes = useStyles();
  const dataArr = props.listData;
  const innerList = (list) => {
    const listArr = [];
    for (const key in list) {
      listArr.push(
        <li key={key}>
          <span>-</span>
          <span>{key}</span>
          <span> ({list[key]})</span>
        </li>
      );
    }
    return listArr;
  };
  const sum = (data) => {
    console.log(data);
    let num = 0;
    for (const key in data) {
      num += data[key];
    }
    return num;
  };
  const temp = [];
  for (const key in dataArr) {
    const region = dataArr[key];
    temp.push(
      <Paper key={region} className={classes.card} elevation={2}>
        <div className={classes['title-tag']}>
          <span>{key}</span>
          <Button
            className="button"
            size="small"
            variant="contained"
            color="primary"
            style={{ height: '30px',marginTop:'6px' }}
          >
            Details
          </Button>
        </div>
        <Divider className="divider"></Divider>
        <div className={classes['list-content']}>
          <div className="content-title">
            <span style={{ marginRight: '10px' }}>No of Cases</span>
            <b>{sum(region.data)}</b>
          </div>
          <Box style={{ height: '180px', overflowY: 'auto' }}>
            <ul>{innerList(region.data)}</ul>
          </Box>
          <div style={{ textAlign: 'right' }}>
            <Button
              className="button"
              size="small"
              variant="contained"
              color="primary"
              style={{marginRight: '6px'}}
              onClick={() =>
                props.showModal(
                  <BarChart data={region} style={{ width: '800px' }} />
                )
              }
            >
              GRAPH
            </Button>
          </div>
        </div>
      </Paper>
    );
  }
  return <React.Fragment>{temp}</React.Fragment>;
};

class Overview extends React.PureComponent {
  //get the context
  constructor(props) {
    super();
    this.state = {
      fromDate: moment('2017-04-11').format('YYYY-MM-DD') + 'T00:00:00.000Z',
      toDate: moment().format('YYYY-MM-DD') + 'T00:00:00.000Z',
      // meters: this.context.meters,
      listData: [],
      showModal: false,
      modalContent: '',
    };
  }
  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <div>
        <div className={this.props.classes.container}>
          <Paper className={this.props.classes.timeTable} elevation={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <div>
                <DatePicker
                  label="From Date"
                  value={this.state.fromDate}
                  format="yyyy-MM-dd"
                  onChange={(e) => this.handleDateChange(e, 'from')}
                  animateYearScrolling
                />
              </div>
              <div>
                <DatePicker
                  className={this.props.classes['date-ipt']}
                  label="To Date"
                  value={this.state.toDate}
                  format="yyyy-MM-dd"
                  onChange={(e) => this.handleDateChange(e, 'to')}
                  animateYearScrolling
                />
              </div>
            </MuiPickersUtilsProvider>

            <div>
              <Button
                className={this.props.classes.button}
                size="small"
                variant="contained"
                color="primary"
                // onClick={() => setRedirect(true)}
                startIcon={<ShowChartIcon />}
              >
                PLOT CASES
              </Button>
              <Button
                className={this.props.classes.button}
                size="small"
                variant="contained"
                color="primary"
                // onClick={() => setRedirect(true)}
                startIcon={<ShowChartIcon />}
              >
                RESET
              </Button>
            </div>
          </Paper>
        </div>
        <div
          style={{ marginTop: '50px' }}
          className={this.props.classes.container}
        >
          <GenerateItem
            closeModal={this.closeModal}
            showModal={this.showModal}
            listData={this.state.listData}
          />
        </div>
        <Modal
          open={this.state.showModal}
          onClose={this.closeModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          >
            {this.state.modalContent}
          </div>
        </Modal>
      </div>
    );
  }

  handleDateChange = (value, type) => {
    let date = moment(value).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    if (type === 'from') {
      this.setState({
        fromDate: date,
      });
    } else {
      this.setState({
        toDate: date,
      });
    }
  };
  showModal = (content) => {
    this.setState({
      showModal: true,
      modalContent: content,
    });
  };
  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };
  getData = () => {
    const { meters } = this.context;
    getAbnormalities({
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
    }).then((res) => {
      let data = res.data.data;
      let totalData = {};
      if (data) {
        data.forEach((item) => {
          const meterInfo = getMeterInfo(meters, item.locationTag_meterTag);
          if (!totalData[meterInfo.region]) {
            totalData[meterInfo.region] = {};
            totalData[meterInfo.region].meterTag = [];
            totalData[meterInfo.region].data = {};
          }
          const tagArr = totalData[meterInfo.region].meterTag;
          let tag = meterInfo.locationTag + '_' + meterInfo.meterTag;
          if (!tagArr.includes(tag)) {
            tagArr.push(tag);
          }
        });
        console.log(totalData, data, 'totalDatatotalData');
        data.forEach((item) => {
          let type = checkClassifiedEvent(item.classifiedCluster);
          for (const regionKey in totalData) {
            const region = totalData[regionKey];
            if (!region.originData) {
              region.originData = [];
            }
            region.originData.push({ ...item, typeName: type, typeVal: 1 });
            if (region.meterTag.includes(item.locationTag_meterTag)) {
              //judge if type in the region of totalData
              if (!region.data[type]) {
                region.data[type] = 1;
              } else {
                region.data[type] += 1;
              }
            }
          }
        });
        this.setState({
          listData: totalData,
        });
      }
    });
  };
}
Overview.contextType = InfoContext;

export default withStyles(styles)(Overview);
