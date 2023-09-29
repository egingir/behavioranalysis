import React, { useCallback, useState, useContext } from 'react';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import CustomSelect from '../../shared/components/FormElements/Select';
import { VALIDATOR_REQUIRE, VALIDATOR_NONE, VALIDATOR_NUMBER } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import Snackbar from '@mui/material/Snackbar';
import { StoreContext } from '../../shared/context/store-context';
import MuiAlert from '@mui/material/Alert';
import { cinsiyetler, testsiralari } from './util';
import { useHistory } from "react-router-dom";
import './task.css';

const Main = () => {
  const store = useContext(StoreContext);
  const history = useHistory();


  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const [formState, inputHandler] = useForm(
    {
      katilimcino: { value: '', isValid: false },
      yas: { value: '', isValid: false },
      cinsiyet: { value: '', isValid: false },
      sinif: { value: '', isValid: false },
      testsirasi: { value: '', isValid: false },
      aciklama: { value: '', isValid: true },
    },
    false
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

const startTests = () => {
if(navigator.onLine === false){
  setSnackMessage('İnternet bağlantınızı kontrol ediniz.');
  setOpenSnack(true);
  return;
}


const allsiras = store.testRegisters.testsirasi;

const firstTest = allsiras.split('-')[0];

history.push("/task" + firstTest);
}

  const saveRegister = useCallback(
    (e) => {
      e.preventDefault();

      if(navigator.onLine === false){
        setSnackMessage('İnternet bağlantınızı kontrol ediniz.');
        setOpenSnack(true);
        return;
      }


      const registerInfo = {
        katilimcino:formState.inputs.katilimcino.value,
        yas: formState.inputs.yas.value,
        sinif: formState.inputs.sinif.value,
        cinsiyet: formState.inputs.cinsiyet.value,
        testsirasi: formState.inputs.testsirasi.value,
        aciklama: formState.inputs.aciklama.value,
        registered: true,
      };

      store.UpdateRegister(registerInfo);
      setSnackMessage('Test sonuçları katılımcı bilgileri ile kaydedilecektir.');
      setOpenSnack(true);
    },
    [formState]
  );

  return (
    <React.Fragment>
      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleClose} severity={snackMessage.startsWith("İnternet") ? 'error' : 'success'} sx={{ width: '100%' }}>
          {snackMessage}
        </MuiAlert>
      </Snackbar>

      <div style={{ marginTop: '200px', display: 'flex', flexDirection: 'row' }}>
        <form className="register-form" style={{width:'50%'}}onSubmit={(e) => saveRegister(e)}>
        <Input
            id="katilimcino"
            element="input"
            type="text"
            label="Katılımcı No"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Katılımcı numarasını giriniz."
            onInput={inputHandler}
          />
       
          <Input
            id="yas"
            element="input"
            type="text"
            label="Yaş"
            validators={[VALIDATOR_NUMBER()]}
            errorText="Katılımcının yaşını giriniz."
            onInput={inputHandler}
          />

          <Input
            id="sinif"
            element="input"
            type="text"
            label="Sınıf"
            validators={[VALIDATOR_NUMBER()]}
            errorText="Katılımcının sınıfını giriniz."
            onInput={inputHandler}
          />

          <CustomSelect
            options={cinsiyetler}
            id="cinsiyet"
            onInput={inputHandler}
            label="Cinsiyet"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Katılımcının cinsiyetini giriniz."
          ></CustomSelect>

            <CustomSelect
            options={testsiralari}
            id="testsirasi"
            onInput={inputHandler}
            label="Test Sırası"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Katılımcının testleri yapacağı sırayı seçiniz."
          ></CustomSelect>

          <Input
            id="aciklama"
            element="textarea"
            type="text"
            label="Açıklama (Opsiyonel)"
            validators={[VALIDATOR_NONE()]}
            onInput={inputHandler}
            initialValid={true}
            initialValue=""
          />

          <Button type="submit" disabled={!formState.isValid}>
            Kaydet
          </Button>

         
        </form>
        <div style={{marginLeft: '100px', marginRight: '50px', width: '30%'}}>
          <b>Kayıtlanacak Katılımcı Bilgileri</b>
          <br/>
          <br/>
          <span><b>Katılımcı No:</b> {store.testRegisters?.registered ? store.testRegisters.katilimcino : ''} </span>
          <br/>
          <br/>
          <span><b>Yaş:</b> {store.testRegisters?.registered ? store.testRegisters.yas : ''} </span>
          <br/>
          <br/>
          <span><b>Sınıf:</b> {store.testRegisters?.registered ? store.testRegisters.sinif : ''} </span>
          <br/>
          <br/>
          <span><b>Cinsiyet:</b> {store.testRegisters?.registered ? store.testRegisters.cinsiyet : ''} </span>
          <br/>
          <br/>
          <span><b>Test Sırası:</b> {store.testRegisters?.registered ? store.testRegisters.testsirasi : ''} </span>
          <br/>
          <br/>
          <span><b>Açıklama:</b> {store.testRegisters?.registered ? store.testRegisters.aciklama : ''} </span>
          <br/>
          <br/>
          <Button onClick={startTests}  disabled={!store.testRegisters?.registered}>
            Sıralı Testi Başlat
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Main;
