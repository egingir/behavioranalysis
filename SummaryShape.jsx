import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import RoomIcon from '@mui/icons-material/Room';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// #region Components
import Input from '../../shared/components/FormElements/Input';
import CustomSelect from '../../shared/components/FormElements/Select';
import DatePicker from '../../shared/components/FormElements/DatePicker';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Modal from '../../shared/components/UIElements/Modal';
import Marker from '../../shared/components/UIElements/Marker';
// #endregion Components

// #region Utils
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_PHONENUMBER,
  VALIDATOR_MAX,
  VALIDATOR_MIN,
  VALIDATOR_NONE,
} from '../../shared/util/validators';
import { paymentMethods, banks, isOfficial, paymentTypes } from '../../shared/util/types';
// #endregion Utils

// #region Hooks
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { StoreContext } from '../../shared/context/store-context';
// #endregion Hooks

import './AccountingItem.css';
import Alert from '@mui/material/Alert';
import styledEngine from '@mui/styled-engine';

const ResultItem = (props) => {
  const auth = useContext(AuthContext);
  const store = useContext(StoreContext);
  const history = useHistory();

  const [tests, setTests] = useState([]);
  const [testInfo, setTestInfo] = useState({});
  const [testResults, setTestResults] = useState([]);

  const [isProcessing, setIsProcessing] = useState(true);


  const calculateAverageRTWidtStd2 = (arr) => {
    if (arr.length === 0) {
      return 0;
    }
  
    // Calculate the mean
    const mean = arr.map((item) => item.sure).reduce((a, b) => a + b, 0) / arr.length;
  
    // Calculate the standard deviation
    const stdDev = Math.sqrt(arr.map((item) => item.sure).reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
  
    // Filter values that are within two standard deviations from the mean
    const filteredArr = arr.filter((item) => {
      return Math.abs(item.sure - mean) <= 2 * stdDev;
    });
  
    // Calculate and return the average of the filtered values
    return [parseInt(filteredArr.map((item) => item.sure).reduce((a, b) => a + b, 0) / filteredArr.length), filteredArr.length];
  };

  const calculateAverageRT = (arr) => {
    if (arr.length === 0) {
      return 0;
    }
    return parseInt((arr.map((item) => item.sure).reduce((a, b) => a + b, 0) / arr.length));
  };
 
  useEffect(() => {

    if(!store.behaviors1 || !store.behaviortests)
      {return} 
    const currentResults =  [...store.behaviortests];
    const currentTestInfo = [...store.behaviors1];
    setTests(currentResults);
    setTestInfo(currentTestInfo);

    let allTests = [];

    for (let i = 0; i < currentResults.length; i++) {
    
        const currentTest = currentResults[i];

        if(!currentTest.tip.includes("Bas/Basma"))
        {
          continue;
        }

        const hit = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.sonuc=== "hit");
        const miss = currentTestInfo.filter((item) => item.behaviortest === currentTest._id && item.sonuc=== "miss");
        const false_alarm = currentTestInfo.filter((item) => item.behaviortest === currentTest._id && item.sonuc=== "false alarm");
        const rejection = currentTestInfo.filter((item) => item.behaviortest === currentTest._id && item.sonuc=== "rejection");
     
      
      
          allTests.push(
            {
              katilimcino: currentTest.katilimcino,
              yas: currentTest.yas,
              cinsiyet: currentTest.cinsiyet,
              sinif: currentTest.sinif,
              hit: hit.length,
              miss: miss.length,
              false_alarm: false_alarm.length,
              rejection: rejection.length,
              hit_rt: calculateAverageRT(hit),
              hit_rt_std2: calculateAverageRTWidtStd2(hit),
              false_alarm_rt: calculateAverageRT(false_alarm),
              false_alarm_rt_std2: calculateAverageRTWidtStd2(false_alarm),
            }
          );
        
    
     
    
  }

  setTestResults(allTests);

  setIsProcessing(false);
  }, [props.itemid, store.behaviors1, store.behaviortests]);
 
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };


 
  if(!store.behaviors1 || isProcessing)
  {
    return (
      <div className="center">
       <LoadingSpinner />
      </div>
    )
  }


  return (
    <React.Fragment>


      {!isLoading && tests && testInfo && (
        <React.Fragment>
          <div className="item-form"> 
            <br />
            <TableContainer component={Paper} sx={{ minWidth: 650 }}>
              <Table
                sx={{ minWidth: 650, width: '100%', justifyContent: 'center', margin: 'auto' }}
                stickyHeader
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                  <TableCell>
                      <b>Sıra</b>
                    </TableCell>
                    <TableCell>
                      <b>Katılımcı ID</b>
                    </TableCell>
                    <TableCell>
                      <b>Yas</b>
                    </TableCell>
                    <TableCell>
                      <b>Cinsiyet</b>
                    </TableCell>
                    <TableCell>
                      <b>Sınıf</b>
                    </TableCell>
                    <TableCell>
                      <b>Hit</b>
                    </TableCell>
                    <TableCell>
                      <b>Miss</b>
                    </TableCell>
                    <TableCell>
                      <b>False Alarm</b>
                    </TableCell>
                    <TableCell>
                      <b>Rejection</b>
                    </TableCell>
                    <TableCell>
                      <b>Hit_RT</b>
                    </TableCell>
                    <TableCell>
                      <b>HIT_RT_STD</b>
                    </TableCell>
                    <TableCell>
                      <b>HIT_RT_STD_N</b>
                    </TableCell>
                    <TableCell>
                      <b>False_Alarm_RT</b>
                    </TableCell>
                    <TableCell>
                      <b>False_Alarm_RT_STD</b>
                    </TableCell>
                    <TableCell>
                      <b>False_Alarm_RT_STD_N</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testResults.map((test, index) => (
                    <TableRow
                      key={test._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                         <TableCell component="th" scope="row">
                        {index+1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.katilimcino}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.yas}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.cinsiyet}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.sinif}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.hit}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.miss}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.false_alarm}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.rejection}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.hit_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.hit_rt_std2[0]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.hit_rt_std2[1]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.false_alarm_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.false_alarm_rt_std2[0]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.false_alarm_rt_std2[1]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          
         
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ResultItem;
