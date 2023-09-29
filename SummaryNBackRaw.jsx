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

        if(!currentTest.tip.includes("Harf N"))
        {
          continue;
        }
     
        const n_0_geri_yap = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "N-0-Geri" && item.beklenen === "1");
        const n_0_geri_yapma = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "N-0-Geri" && item.beklenen === "0");
        const n_1_geri_yap = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "N-1-Geri" && item.beklenen === "1");
        const n_1_geri_yapma = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "N-1-Geri" && item.beklenen === "0");
        const n_2_geri_yap = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "N-2-Geri" && item.beklenen === "1");
        const n_2_geri_yapma = currentTestInfo.filter((item) => item.behaviortest === currentTest._id &&  item.uyarici === "N-2-Geri" && item.beklenen === "0");

        for(let j = 0; j < n_0_geri_yap.length; j++){
          const current_n_0_geri_yap = n_0_geri_yap[j];
          const current_n_0_geri_yapma = n_0_geri_yapma[j];
          const current_n_1_geri_yap = n_1_geri_yap[j];
          const current_n_1_geri_yapma = n_1_geri_yapma[j];
          const current_n_2_geri_yap = n_2_geri_yap[j];
          const current_n_2_geri_yapma = n_2_geri_yapma[j];

          
      
          allTests.push(
            {
              katilimcino: currentTest.katilimcino,
              yas: currentTest.yas,
              cinsiyet: currentTest.cinsiyet,
              sinif: currentTest.sinif,
              n_0_geri_yap: current_n_0_geri_yap.tepki,
              n_0_geri_yapma: current_n_0_geri_yapma.tepki,
              n_1_geri_yap: current_n_1_geri_yap.tepki,
              n_1_geri_yapma: current_n_1_geri_yapma.tepki,
              n_2_geri_yap: current_n_2_geri_yap.tepki,
              n_2_geri_yapma: current_n_2_geri_yapma.tepki,
              n_0_geri_yap_rt: current_n_0_geri_yap.sure,
              n_0_geri_yapma_rt: current_n_0_geri_yapma.sure,
              n_1_geri_yap_rt: current_n_1_geri_yap.sure,
              n_1_geri_yapma_rt: current_n_1_geri_yapma.sure,
              n_2_geri_yap_rt: current_n_2_geri_yap.sure,
              n_2_geri_yapma_rt: current_n_2_geri_yapma.sure,
            }
          );
        }
    
        setTestResults(allTests);
    
  }

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
                      <b>n-0-yap</b>
                    </TableCell>
                    <TableCell>
                      <b>n-0-yapma</b>
                    </TableCell>
                    <TableCell>
                      <b>n-1-yap</b>
                    </TableCell>
                    <TableCell>
                      <b>n-1-yapma</b>
                    </TableCell>
                    <TableCell>
                      <b>n-2-yap</b>
                    </TableCell>
                    <TableCell>
                      <b>n-2-yapma</b>
                    </TableCell>
                    <TableCell>
                      <b>n-0-yap-rt</b>
                    </TableCell>
                    <TableCell>
                      <b>n-0-yapma-rt</b>
                    </TableCell>
                    <TableCell>
                      <b>n-1-yap-rt</b>
                    </TableCell>
                    <TableCell>
                      <b>n-1-yapma-rt</b>
                    </TableCell>
                    <TableCell>
                      <b>n-2-yap-rt</b>
                    </TableCell>
                    <TableCell>
                      <b>n-2-yapma-rt</b>
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
                       {test.n_0_geri_yap}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_0_geri_yapma}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_1_geri_yap}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_1_geri_yapma}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_2_geri_yap}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_2_geri_yapma}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_0_geri_yap_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_0_geri_yapma_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_1_geri_yap_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_1_geri_yapma_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_2_geri_yap_rt}
                      </TableCell>
                      <TableCell component="th" scope="row">
                       {test.n_2_geri_yapma_rt}
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
