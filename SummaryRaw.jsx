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
import { is } from 'date-fns/locale';

const ResultItem = (props) => {
  const auth = useContext(AuthContext);
  const store = useContext(StoreContext);
  const history = useHistory();

  const [tests, setTests] = useState([]);
  const [testInfo, setTestInfo] = useState({});
  const [testResults, setTestResults] = useState([]);

  const [isProcessing, setIsProcessing] = useState(true);

 
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
     
        const notr_uyumsuz = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumsuz");
        const notr_uyumlu = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "notr - uyumlu");
        const olumlu_uyumsuz =  currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumsuz");
        const olumlu_uyumlu =  currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumlu - uyumlu");
        const olumsuz_uyumsuz =  currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumsuz");
        const olumsuz_uyumlu =  currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "olumsuz - uyumlu");


        for(let j = 0; j < notr_uyumsuz.length; j++){
          const currentNotrUyumsuz = notr_uyumsuz[j];
          const currentNotrUyumlu = notr_uyumlu[j];
          const currentOlumluUyumsuz = olumlu_uyumsuz[j];
          const currentOlumluUyumlu = olumlu_uyumlu[j];
          const currentOlumsuzUyumsuz = olumsuz_uyumsuz[j];
          const currentOlumsuzUyumlu = olumsuz_uyumlu[j];
      
          allTests.push(
            {
              katilimcino: currentTest.katilimcino,
              yas: currentTest.yas,
              cinsiyet: currentTest.cinsiyet,
              sinif: currentTest.sinif,
              notr_uyumsuz_ACC: currentNotrUyumsuz.tepki,
              notr_uyumlu_ACC: currentNotrUyumlu.tepki,
              olumlu_uyumsuz_ACC: currentOlumluUyumsuz.tepki,
              olumlu_uyumlu_ACC: currentOlumluUyumlu.tepki,
              olumsuz_uyumsuz_ACC: currentOlumsuzUyumsuz.tepki,
              olumsuz_uyumlu_ACC: currentOlumsuzUyumlu.tepki,
              notr_uyumsuz_RT: currentNotrUyumsuz.sure,
              notr_uyumlu_RT: currentNotrUyumlu.sure,
              olumlu_uyumsuz_RT: currentOlumluUyumsuz.sure,
              olumlu_uyumlu_RT: currentOlumluUyumlu.sure,
              olumsuz_uyumsuz_RT: currentOlumsuzUyumsuz.sure,
              olumsuz_uyumlu_RT: currentOlumsuzUyumlu.sure,
            }
          );
        }
    

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
                      <b>notr_uyumsuz_ACC</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumlu_ACC</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumsuz_ACC</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumlu_ACC</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumsuz_ACC</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumlu_ACC</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumsuz_RT</b>
                    </TableCell>
                    <TableCell>
                      <b>notr_uyumlu_RT</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumsuz_RT</b>
                    </TableCell>
                    <TableCell>
                      <b>olumlu_uyumlu_RT</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumsuz_RT</b>
                    </TableCell>
                    <TableCell>
                      <b>olumsuz_uyumlu_RT</b>
                    </TableCell>  
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testResults.map((test) => (
                    <TableRow
                      key={test._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
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
                       {test.notr_uyumsuz_ACC}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.notr_uyumlu_ACC}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.olumlu_uyumsuz_ACC}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.olumlu_uyumlu_ACC}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.olumsuz_uyumsuz_ACC}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.olumsuz_uyumlu_ACC}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.notr_uyumsuz_RT}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.notr_uyumlu_RT}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.olumlu_uyumsuz_RT}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.olumlu_uyumlu_RT}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.olumsuz_uyumsuz_RT}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {test.olumsuz_uyumlu_RT}
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
