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

const ResultItem = (props) => {
  const auth = useContext(AuthContext);
  const store = useContext(StoreContext);
  const history = useHistory();

  const [results, setResults] = useState([]);
  const [testInfo, setTestInfo] = useState({});

  useEffect(() => {
    const currentResults =  store.behaviors1.filter((x) => x.behaviortest.toString() === props.itemid.toString());
    const currentTestInfo = store.behaviortests.find((x) => x._id.toString() === props.itemid.toString());
    setResults(currentResults);
    setTestInfo(currentTestInfo);
  }, [props.itemid]);
 
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/behaviortests/${props.itemid}`,
        'DELETE',
        null,
        {
          'Content-Type': 'application/json',
        }
      );
    
      store.UpdateBehaviortests();
      store.UpdateBehaviors1();
      setResults([]);
      props.onClose();

      history.push(`/results`);
    } catch (err) {}
  };


  if (!results || !testInfo) {
    return (
      <div className="center">
        <Card>
          <h2>Test sonucu bulunamadı.</h2>
        </Card>
      </div>
    );
  }



  return (
    <React.Fragment>
  <Modal
        small={true}
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Emin misiniz?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              Hayır
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Evet
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Test silme işlemini onaylıyor musunuz? Bu işlem geri alınamaz.
        </p>
      </Modal>

      {!isLoading && results && testInfo && (
        <React.Fragment>
          <div className="item-form">
            <div className="button-container">
              <Button type="button" onClick={props.onClose}>
                &#60; Geri
              </Button>
              <Button type="button" danger onClick={showDeleteWarningHandler}>
              SİL
            </Button>
            </div>
            <br />
            <br />
            <b>Test Tarihi: </b>
            {testInfo.date}
            <br />
            <br />
            <b>Test Türü: </b>
            {testInfo.tip}
            <br />
            <br />
            <b>Test Sırası: </b>
            {testInfo.testsirasi}
            <br />
            <br />
            <b>Test Sorumlusu: </b>
            {testInfo.sorumlu}
            <br />
            <br />
            <b>Katılımcı No: </b>
            {testInfo.katilimcino}
            <br />
            <br />
            <b>Yaş: </b>
            {testInfo.yas}
            <br />
            <br />
            <b>Sınıf: </b>
            {testInfo.sinif}
            <br />
            <br />
            <b>Cinsiyet: </b>
            {testInfo.cinsiyet}
            <br />
            <br />
            <b>Açıklama: </b>
            {testInfo.aciklama}
            <br />
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
                      <b>Uyarıcı</b>
                    </TableCell>
                    <TableCell>
                      <b>Görüntü</b>
                    </TableCell>
                    <TableCell>
                      <b>Beklenen</b>
                    </TableCell>
                    <TableCell>
                      <b>Tepki</b>
                    </TableCell>
                    <TableCell>
                      <b>Süre</b>
                    </TableCell>
                    <TableCell>
                      <b>Sonuç</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow
                      key={result._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {result.uyarici}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {result.sekil}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {result.beklenen}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {result.tepki}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {result.sure}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {result.sonuc}
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
