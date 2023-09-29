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

        if(!currentTest.tip.includes("Görsel Nokta"))
        {
          continue;
        }
     
        const n_0_geri_hit = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumsuz" && item.sonuc=== "hit");
        const n_0_geri_miss = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumsuz" && item.sonuc=== "miss");
        const n_0_geri_false_alarm = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumsuz" && item.sonuc=== "false alarm");
        const n_0_geri_rejection = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumsuz" && item.sonuc=== "rejection");

      
        const n_1_geri_hit = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumlu" && item.sonuc=== "hit");
        const n_1_geri_miss = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumlu" && item.sonuc=== "miss");
        const n_1_geri_false_alarm = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumlu" && item.sonuc=== "false alarm");
        const n_1_geri_rejection = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumlu" && item.sonuc=== "rejection");

        const n_2_geri_hit = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumsuz" && item.sonuc=== "hit");
        const n_2_geri_miss = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumsuz" && item.sonuc=== "miss");
        const n_2_geri_false_alarm = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumsuz" && item.sonuc=== "false alarm");
        const n_2_geri_rejection = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumsuz" && item.sonuc=== "rejection");


        const n_3_geri_hit = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumlu" && item.sonuc=== "hit");
        const n_3_geri_miss = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumlu" && item.sonuc=== "miss");
        const n_3_geri_false_alarm = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumlu" && item.sonuc=== "false alarm");
        const n_3_geri_rejection = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumlu" && item.sonuc=== "rejection");

        const n_4_geri_hit = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumsuz" && item.sonuc=== "hit");
        const n_4_geri_miss = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumsuz" && item.sonuc=== "miss");
        const n_4_geri_false_alarm = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumsuz" && item.sonuc=== "false alarm");
        const n_4_geri_rejection = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumsuz" && item.sonuc=== "rejection");

        const n_5_geri_hit = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumlu" && item.sonuc=== "hit");
        const n_5_geri_miss = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumlu" && item.sonuc=== "miss");
        const n_5_geri_false_alarm = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumlu" && item.sonuc=== "false alarm");
        const n_5_geri_rejection = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumlu" && item.sonuc=== "rejection");


      
          allTests.push(
            {
              katilimcino: currentTest.katilimcino,
              yas: currentTest.yas,
              cinsiyet: currentTest.cinsiyet,
              sinif: currentTest.sinif,
              n_0_geri_hit: n_0_geri_hit.length,
              n_0_geri_miss: n_0_geri_miss.length,
              n_0_geri_false_alarm: n_0_geri_false_alarm.length,
              n_0_geri_rejection: n_0_geri_rejection.length,
              n_1_geri_hit: n_1_geri_hit.length,
              n_1_geri_miss: n_1_geri_miss.length,
              n_1_geri_false_alarm: n_1_geri_false_alarm.length,
              n_1_geri_rejection: n_1_geri_rejection.length,
              n_2_geri_hit: n_2_geri_hit.length,
              n_2_geri_miss: n_2_geri_miss.length,
              n_2_geri_false_alarm: n_2_geri_false_alarm.length,
              n_2_geri_rejection: n_2_geri_rejection.length,
              n_3_geri_hit: n_3_geri_hit.length,
              n_3_geri_miss: n_3_geri_miss.length,
              n_3_geri_false_alarm: n_3_geri_false_alarm.length,
              n_3_geri_rejection: n_3_geri_rejection.length,
              n_4_geri_hit: n_4_geri_hit.length,
              n_4_geri_miss: n_4_geri_miss.length,
              n_4_geri_false_alarm: n_4_geri_false_alarm.length,
              n_4_geri_rejection: n_4_geri_rejection.length,
              n_5_geri_hit: n_5_geri_hit.length,
              n_5_geri_miss: n_5_geri_miss.length,
              n_5_geri_false_alarm: n_5_geri_false_alarm.length,
              n_5_geri_rejection: n_5_geri_rejection.length,


              n_0_geri_hit_rt: calculateAverageRT(n_0_geri_hit),
              n_0_geri_hit_rt_std2: calculateAverageRTWidtStd2(n_0_geri_hit),
              n_0_geri_miss_rt: calculateAverageRT(n_0_geri_miss),
              n_0_geri_miss_rt_std2: calculateAverageRTWidtStd2(n_0_geri_miss),
              n_0_geri_false_alarm_rt: calculateAverageRT(n_0_geri_false_alarm),
              n_0_geri_false_alarm_rt_std2: calculateAverageRTWidtStd2(n_0_geri_false_alarm),
              n_0_geri_rejection_rt: calculateAverageRT(n_0_geri_rejection),
              n_0_geri_rejection_rt_std2: calculateAverageRTWidtStd2(n_0_geri_rejection),
              n_1_geri_hit_rt: calculateAverageRT(n_1_geri_hit),
              n_1_geri_hit_rt_std2: calculateAverageRTWidtStd2(n_1_geri_hit),
              n_1_geri_miss_rt: calculateAverageRT(n_1_geri_miss),
              n_1_geri_miss_rt_std2: calculateAverageRTWidtStd2(n_1_geri_miss),
              n_1_geri_false_alarm_rt: calculateAverageRT(n_1_geri_false_alarm),
              n_1_geri_false_alarm_rt_std2: calculateAverageRTWidtStd2(n_1_geri_false_alarm),
              n_1_geri_rejection_rt: calculateAverageRT(n_1_geri_rejection),
              n_1_geri_rejection_rt_std2: calculateAverageRTWidtStd2(n_1_geri_rejection),
              n_2_geri_hit_rt: calculateAverageRT(n_2_geri_hit),
              n_2_geri_hit_rt_std2: calculateAverageRTWidtStd2(n_2_geri_hit),
              n_2_geri_miss_rt: calculateAverageRT(n_2_geri_miss),
              n_2_geri_miss_rt_std2: calculateAverageRTWidtStd2(n_2_geri_miss),
              n_2_geri_false_alarm_rt: calculateAverageRT(n_2_geri_false_alarm),
              n_2_geri_false_alarm_rt_std2: calculateAverageRTWidtStd2(n_2_geri_false_alarm),
              n_2_geri_rejection_rt: calculateAverageRT(n_2_geri_rejection),
              n_2_geri_rejection_rt_std2: calculateAverageRTWidtStd2(n_2_geri_rejection),
              n_3_geri_hit_rt: calculateAverageRT(n_3_geri_hit),
              n_3_geri_hit_rt_std2: calculateAverageRTWidtStd2(n_3_geri_hit),
              n_3_geri_miss_rt: calculateAverageRT(n_3_geri_miss),
              n_3_geri_miss_rt_std2: calculateAverageRTWidtStd2(n_3_geri_miss),
              n_3_geri_false_alarm_rt: calculateAverageRT(n_3_geri_false_alarm),
              n_3_geri_false_alarm_rt_std2: calculateAverageRTWidtStd2(n_3_geri_false_alarm),
              n_3_geri_rejection_rt: calculateAverageRT(n_3_geri_rejection),
              n_3_geri_rejection_rt_std2: calculateAverageRTWidtStd2(n_3_geri_rejection),
              n_4_geri_hit_rt: calculateAverageRT(n_4_geri_hit),
              n_4_geri_hit_rt_std2: calculateAverageRTWidtStd2(n_4_geri_hit),
              n_4_geri_miss_rt: calculateAverageRT(n_4_geri_miss),
              n_4_geri_miss_rt_std2: calculateAverageRTWidtStd2(n_4_geri_miss),
              n_4_geri_false_alarm_rt: calculateAverageRT(n_4_geri_false_alarm),
              n_4_geri_false_alarm_rt_std2: calculateAverageRTWidtStd2(n_4_geri_false_alarm),
              n_4_geri_rejection_rt: calculateAverageRT(n_4_geri_rejection),
              n_4_geri_rejection_rt_std2: calculateAverageRTWidtStd2(n_4_geri_rejection),
              n_5_geri_hit_rt: calculateAverageRT(n_5_geri_hit),
              n_5_geri_hit_rt_std2: calculateAverageRTWidtStd2(n_5_geri_hit),
              n_5_geri_miss_rt: calculateAverageRT(n_5_geri_miss),
              n_5_geri_miss_rt_std2: calculateAverageRTWidtStd2(n_5_geri_miss),
              n_5_geri_false_alarm_rt: calculateAverageRT(n_5_geri_false_alarm),
              n_5_geri_false_alarm_rt_std2: calculateAverageRTWidtStd2(n_5_geri_false_alarm),
              n_5_geri_rejection_rt: calculateAverageRT(n_5_geri_rejection),
              n_5_geri_rejection_rt_std2: calculateAverageRTWidtStd2(n_5_geri_rejection),
            }



            

          
          );
        }
    
        setTestResults(allTests);
    
  }, [props.itemid, store.behaviors1, store.behaviortests]);
 
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };


 
  if(!store.behaviors1)
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
                      <b>notr_uyumsuz_hit</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumsuz_miss</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumsuz_false_alarm</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumsuz_rejection</b>
                    </TableCell>


                    <TableCell>
                      <b>notr_uyumlu_hit</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumlu_miss</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumlu_false_alarm</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumlu_rejection</b>
                    </TableCell>
                 

                    <TableCell>
                      <b>olumlu_uyumsuz_hit</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumsuz_miss</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumsuz_false_alarm</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumsuz_rejection</b>
                    </TableCell>


                    <TableCell>
                      <b>olumlu_uyumlu_hit</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumlu_miss</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumlu_false_alarm</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumlu_rejection</b>
                    </TableCell>


                    <TableCell>
                      <b>olumsuz_uyumsuz_hit</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumsuz_miss</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumsuz_false_alarm</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumsuz_rejection</b>
                    </TableCell>
                 
                 
                    <TableCell>
                      <b>olumsuz_uyumlu_hit</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumlu_miss</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumlu_false_alarm</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumlu_rejection</b>
                    </TableCell>
                 
                 
                    <TableCell>
                      <b>notr_uyumsuz_hit_rt</b>
                    </TableCell>

                    <TableCell>
                      <b>notr_uyumsuz_hit_rt_std2</b>
                    </TableCell>

                    <TableCell>
                      <b>notr_uyumsuz_hit_rt_std2_N</b>
                    </TableCell>

                    <TableCell>
                      <b>notr_uyumlu_hit_rt</b>
                    </TableCell>

                    <TableCell>
                      <b>notr_uyumlu_hit_rt_std2</b>
                    </TableCell>

                    <TableCell>
                      <b>notr_uyumlu_hit_rt_std2_N</b>
                    </TableCell>

                    <TableCell>
                      <b>olumlu_uyumsuz_hit_rt</b>
                    </TableCell>

                    <TableCell>
                      <b>olumlu_uyumsuz_hit_rt_std2</b>
                    </TableCell>

                    <TableCell>
                      <b>olumlu_uyumsuz_hit_rt_std2_N</b>
                    </TableCell>

                    <TableCell>
                      <b>olumlu_uyumlu_hit_rt</b>
                    </TableCell>

                    <TableCell>
                      <b>olumlu_uyumlu_hit_rt_std2</b>
                    </TableCell>

                    <TableCell>
                      <b>olumlu_uyumlu_hit_rt_std2_N</b>
                    </TableCell>

                    <TableCell>
                      <b>olumsuz_uyumsuz_hit_rt</b>
                    </TableCell>

                    <TableCell>
                      <b>olumsuz_uyumsuz_hit_rt_std2</b>
                    </TableCell>

                    <TableCell>
                      <b>olumsuz_uyumsuz_hit_rt_std2_N</b>
                    </TableCell>


                    <TableCell>
                      <b>olumsuz_uyumlu_hit_rt</b>
                    </TableCell>

                    <TableCell>
                      <b>olumsuz_uyumlu_hit_rt_std2</b>
                    </TableCell>


                    <TableCell>
                      <b>olumsuz_uyumlu_hit_rt_std2_N</b>
                    </TableCell>

                 
             
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testResults.map((test,index) => (
                    <TableRow
                      key={test._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {(index+1)}
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
                       {test.n_0_geri_hit}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_0_geri_miss}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_0_geri_false_alarm}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_0_geri_rejection}
                      </TableCell>
                     

                      <TableCell component="th" scope="row">
                       {test.n_1_geri_hit}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_1_geri_miss}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_1_geri_false_alarm}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_1_geri_rejection}
                      </TableCell>


                      <TableCell component="th" scope="row">
                       {test.n_2_geri_hit}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_2_geri_miss}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_2_geri_false_alarm}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_2_geri_rejection}
                      </TableCell>


                      <TableCell component="th" scope="row">
                       {test.n_3_geri_hit}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_3_geri_miss}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_3_geri_false_alarm}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_3_geri_rejection}
                      </TableCell>


                      <TableCell component="th" scope="row">
                       {test.n_4_geri_hit}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_4_geri_miss}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_4_geri_false_alarm}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_4_geri_rejection}
                      </TableCell>


                      <TableCell component="th" scope="row">
                       {test.n_5_geri_hit}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_5_geri_miss}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_5_geri_false_alarm}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_5_geri_rejection}
                      </TableCell>


                      <TableCell component="th" scope="row">
                        {test.n_0_geri_hit_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_0_geri_hit_rt_std2[0]}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {test.n_0_geri_hit_rt_std2[1]}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {test.n_1_geri_hit_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_1_geri_hit_rt_std2[0]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_1_geri_hit_rt_std2[1]}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {test.n_2_geri_hit_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_2_geri_hit_rt_std2[0]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_2_geri_hit_rt_std2[1]}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {test.n_3_geri_hit_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_3_geri_hit_rt_std2[0]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_3_geri_hit_rt_std2[1]}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {test.n_4_geri_hit_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_4_geri_hit_rt_std2[0]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_4_geri_hit_rt_std2[1]}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {test.n_5_geri_hit_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_5_geri_hit_rt_std2[0]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.n_5_geri_hit_rt_std2[1]}
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
