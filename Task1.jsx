import React, { useCallback, useState, useContext, useRef } from 'react';
import Button from '../../shared/components/FormElements/Button';
import './task.css';
import { sleep, getdB } from './util.js';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { StoreContext } from '../../shared/context/store-context';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { doc, setDoc } from 'firebase/firestore';
import { DoorBack } from '@mui/icons-material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { onValue, ref } from 'firebase/database';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../shared/components/UIElements/Modal';
import { useHistory } from "react-router-dom";

const Task1 = () => {
  const auth = useContext(AuthContext);
  const store = useContext(StoreContext);
  const history = useHistory();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  //interface related
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [shape, setShape] = useState(null);
  const [showCountDown, setShowCountDown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countDownDuration, setCountDownDuration] = useState(10);
  const [blockStarted, setBlockStarted] = useState(false);

  //ref related
  const refYap = useRef(null);
  const refShape = useRef(null);
  const refStartTime = useRef(0);
  const refClicked = useRef(false);
  const refClickTime = useRef(0);
  const refResults = useRef([]);
  const yapCounter = useRef(0);
  const yapmaCounter = useRef(0);
  const refAllowClick = useRef(false);
  const refShowModal = useRef(false);
  const refModalType = useRef(1);
  const refCountDownText = useRef('');
  const refCurrentBlock = useRef(0);
  const refBlockStarted = useRef(false);
  const refNextTest = useRef(null);

  //Not in reset
  const stopTestREF = useRef(false);
  const [stopTest, setStopTest] = useState(false);
  const [openNotRegistedSnack, setOpenNotRegistedSnack] = useState(false);
  const [openNotInternetSnack, setOpenNotInternetSnack] = useState(false);

  let yapLimit = 60;
  let yapmaLimit = 20;

  const getYap = (isPractice = false) => {
    let yap = null;

    if (isPractice) {
      yapLimit = 21;
      yapmaLimit = 7;
    } else {
      yapLimit = 60;
      yapmaLimit = 20;
    }

    if (yapCounter.current == yapLimit && yapmaCounter.current == yapmaLimit) {
      return null;
    }

    if (yapCounter.current == yapLimit && yapmaCounter.current < yapmaLimit) {
      yap = 'yapma';
      yapmaCounter.current++;
      return yap;
    }

    if (yapCounter.current < yapLimit && yapmaCounter.current == yapmaLimit) {
      yap = 'yap';
      yapCounter.current++;
      return yap;
    }

    const random = Math.random();

    if (random < 0.75) {
      yap = 'yap';
      yapCounter.current++;
    } else {
      yap = 'yapma';
      yapmaCounter.current++;
    }

    return yap;
  };

  const getShape = (type) => {
    let extractedShape = null;

    if (type == 'yap') {
      const random = Math.random();
      if (random < 0.33) {
        extractedShape = 'buyuk-kare';
      } else if (random < 0.66) {
        extractedShape = 'kucuk-daire';
      } else {
        extractedShape = 'buyuk-daire';
      }
    } else {
      extractedShape = 'kucuk-kare';
    }

    return extractedShape;
  };

  const checkYap = () => {
    // refYap.current = currentYap;
    // refShape.current = currentShape;
  };

  const recordClick = () => {
    if (!refClicked.current && refAllowClick.current) {
      refClicked.current = true;
      refClickTime.current = performance.now();
    }
  };

  const modalClose = (stop) => {
    if (stop) {
      setStopTest(true);
      stopTestREF.current = true;
    }

    setShowModal(false);
    refShowModal.current = false;
  };

  const saveResult = () => {
    // const response = await fetch('https://davranis-degerlendirme-default-rtdb.europe-west1.firebasedatabase.app/results.json');

    let responseTime = 0;

    if (refClicked.current) {
      responseTime = Math.floor(refClickTime.current - refStartTime.current);
    }

    let tepki = 'yanlış';
    let sonuc = '';

    if (refYap.current == 'yap' && refClicked.current) {
      tepki = 'doğru';
      sonuc = 'hit';
    }
    if (refYap.current == 'yap' && !refClicked.current) {
      tepki = 'yanlış';
      sonuc = 'miss';
    }

    if (refYap.current == 'yapma' && !refClicked.current) {
      tepki = 'doğru';
      sonuc = 'rejection';
    }

    if (refYap.current == 'yapma' && refClicked.current) {
      tepki = 'yanlış';
      sonuc = 'false alarm';
    }

    let beklenen = refYap.current == 'yap' ? '1' : '0';

    const result = {
      uyarici: 'Bas/Basma',
      sekil: refShape.current,
      beklenen: beklenen,
      tepki: tepki,
      sure: responseTime,
      sonuc: sonuc,
    };

    refResults.current.push(result);
    // const resultResponse = await fetch('https://davranis-degerlendirme-default-rtdb.europe-west1.firebasedatabase.app/results.json',
    // {
    //   method: 'POST',
    //   body: JSON.stringify(result),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
  };

  const reset = () => {
    //interface related
    setStarted(false);
    setFinished(false);
    setShape(null);
    setLoading(false);
    setShowCountDown(false);
    setShowModal(false);
    setCountDownDuration(5);
    setBlockStarted(false);

    //ref related
    refYap.current = null;
    refShape.current = null;
    refStartTime.current = 0;
    refClicked.current = false;
    refClickTime.current = 0;
    yapCounter.current = 0;
    yapmaCounter.current = 0;
    refAllowClick.current = false;
    refShowModal.current = false;
    refCountDownText.current = '';
    refCurrentBlock.current = 0;
    refBlockStarted.current = false;
    refModalType.current = 1;


    const currentTestSirasi = '1';
    const testSirasi = store.testRegisters.testsirasi.split('-');

    for (let i = 0; i < testSirasi.length; i++) {
      const element = testSirasi[i];
      if(element == '1')
      {
          if(i !== testSirasi.length-1)
          {
            refNextTest.current = testSirasi[i+1];
          }

      }
      
 
  }



  };

  const recordResults = async () => {
    setLoading(true);

    const behaviortestEndpoint = 'behaviortests';
    const behaviorEndpoint = 'behaviors';

    const registerInfo = store.testRegisters;
    const testData = {
      sorumlu: 'Test Kullanıcısı',
      tip: 'Bas/Basma (1)',
      yas: registerInfo.yas,
      testsirasi: registerInfo.testsirasi,
      katilimcino: registerInfo.katilimcino,
      sinif: registerInfo.sinif,
      cinsiyet: registerInfo.cinsiyet,
      aciklama: registerInfo.aciklama,
    };

    let behaviorTestId = null;
    while(!behaviorTestId)
    {
    try {
      const behaviorTestResponse = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/${behaviortestEndpoint}`,
        'POST',
        JSON.stringify(testData),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );

      behaviorTestId = behaviorTestResponse.behaviortest._id;
    } catch (err) {
      sleep(2000);
     }
  }

    for (let i = 0; i < refResults.current.length; i++) {
      const result = refResults.current[i];
      result.behaviortest = behaviorTestId;

      try {
        const behaviorResponse = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/${behaviorEndpoint}`,
          'POST',
          JSON.stringify(result),
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          }
        );

   
      } catch (err) { }
    }

    // const behaviorData = {
    //   behaviortest: behaviorTestId,
    //   uyarici: 'test',
    //   sekil: 'test',
    //   beklenen: 'test',
    //   tepki: 'test',
    //   sure: 0,
    //   sonuc: 'test',
    // };

    store.UpdateBehaviortests();
    store.UpdateBehaviors1();
    setLoading(false);
  };

  const cancelTest = () => {
    reset();
    setStopTest(true);
    stopTestREF.current = true;
  };

  const start = async () => {

    if(navigator.onLine === false){
      setOpenNotInternetSnack(true);
      return;
    }
    refResults.current = [];

    const registerInfo = store.testRegisters;

    //Open it in production
    if (!registerInfo || !registerInfo.registered) {
      setOpenNotRegistedSnack(true);
      return;
    }

    reset();

    //#region Modal Screen
    refShowModal.current = true;
    setShowModal(true);

    while (refShowModal.current) {
      await new Promise((r) => setTimeout(r, 10));
    }

    if (stopTestREF.current) {
      stopTestREF.current = false;
      setStopTest(false);
      reset();
      return;
    }
    //#endregion Modal Screen

    refCountDownText.current = 'Alıştırma Başlıyor...';
    setShowCountDown(true);
    await sleep(5000);

    if (stopTestREF.current) {
      stopTestREF.current = false;
      setStopTest(false);
      reset();
      return;
    }

    setShowCountDown(false);
    setStarted(true);
    setBlockStarted(true);
    refBlockStarted.current = true;
    await sleep(1000);
    while (true) {
      if (stopTestREF.current) {
        stopTestREF.current = false;
        setStopTest(false);
        reset();
        return;
      }

      const currentYap = getYap(true);
      if (currentYap == null) {
        reset();
        //setFinished(true);
        break;
      }

      const currentShape = getShape(currentYap);
      refYap.current = currentYap;
      refShape.current = currentShape;
      refClicked.current = false;

      setShape(currentShape);
      refAllowClick.current = true;
      refStartTime.current = performance.now();
      await sleep(200);
      setShape(null);
      await sleep(1000);
      refAllowClick.current = false;
    }


    //#region Modal Screen
    refModalType.current = 2;
    refShowModal.current = true;
    setShowModal(true);

    while (refShowModal.current) {
      await new Promise((r) => setTimeout(r, 10));
    }

    if (stopTestREF.current) {
      stopTestREF.current = false;
      setStopTest(false);
      reset();
      return;
    }
    //#endregion Modal Screen

    refCountDownText.current = 'Test Başlıyor...';
    setShowCountDown(true);
    await sleep(5000);

    if (stopTestREF.current) {
      stopTestREF.current = false;
      setStopTest(false);
      reset();
      return;
    }

    reset();

    setShowCountDown(false);
    setStarted(true);
    setBlockStarted(true);
    refBlockStarted.current = true;
    refCurrentBlock.current = 1;
    await sleep(1000);
    while (true) {
      if (stopTestREF.current) {
        stopTestREF.current = false;
        setStopTest(false);
        reset();
        return;
      }

      let currentYap = getYap(false);
      if (currentYap == null) {
        if (refCurrentBlock.current == 1) {

          setBlockStarted(false);
          refBlockStarted.current = false;
          yapCounter.current = 0;
          yapmaCounter.current = 0;
          refCurrentBlock.current = 2;
          setCountDownDuration(60);
          refCountDownText.current = 'Teste ara verildi...';
          setShowCountDown(true);
          await sleep(60000);
          setShowCountDown(false);
          while (!refBlockStarted.current) {
            await new Promise((r) => setTimeout(r, 1000));
          }
          currentYap = getYap(false);
        } else if (refCurrentBlock.current == 2) {
          setBlockStarted(false);
          refBlockStarted.current = false;
          yapCounter.current = 0;
          yapmaCounter.current = 0;
          refCurrentBlock.current = 3;
          setCountDownDuration(60);
          refCountDownText.current = 'Teste Ara Verildi...';
          setShowCountDown(true);
          await sleep(60000);
          setShowCountDown(false);
          while (!refBlockStarted.current) {
            await new Promise((r) => setTimeout(r, 1000));
          }
          currentYap = getYap(false);
        } else if (refCurrentBlock.current == 3) {
          await recordResults();
          reset();
          setFinished(true);
          return;
        }
      }

      const currentShape = getShape(currentYap);
      refYap.current = currentYap;
      refShape.current = currentShape;
      refClicked.current = false;

      setShape(currentShape);
      refAllowClick.current = true;
      refStartTime.current = performance.now();
      await sleep(200);
      setShape(null);
      await sleep(1000);
      refAllowClick.current = false;
      saveResult();
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenNotRegistedSnack(false);
  };


  const handleCloseNotInternet = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenNotInternetSnack(false);
  };

  if (stopTestREF.current) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="center">
        <LoadingSpinner />
        {navigator.onLine === false && <p>Sonuçlar kaydedilemiyor. Sayfayı kapatmadan internet bağlantınızı konrol ediniz.</p>}
        {navigator.onLine === true && <p>Sonuçlar kaydediliyor...</p>}
      </div>
    );
  }

  if (showCountDown) {
    return (
      <div className="center">
        <div
          style={{
            fontSize: '32px',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: '-webkit-center',
          }}
        >
          <CountdownCircleTimer
            isPlaying
            duration={countDownDuration}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
          <br />
          {refCountDownText.current}
        </div>
        <div style={{ position: 'fixed', bottom: '100px' }}>
          <Button type="button" size="big" onClick={() => { }}>
            BAS
          </Button>
        </div>
        <div style={{ position: 'fixed', top: '100px', left: '1px' }}>
          <Button
            type="button"
            size="xsmall"
            onClick={() => {
              cancelTest();
            }}
          >
            İPTAL
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="center" style={{ flexDirection: 'column' }}>
      <Snackbar
        open={openNotRegistedSnack}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Kullanıcı kayıtlarını giriniz.
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={openNotInternetSnack}
        autoHideDuration={2000}
        onClose={handleCloseNotInternet}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          İnternet bağlantınızı kontrol ediniz.
        </MuiAlert>
      </Snackbar>

      <Modal
        show={showModal}
        header="Test Yönergeleri"
        onCancel={() => modalClose(true)}
        footerClass="modal-footer"
        footer={
          <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button danger onClick={() => modalClose(true)}>
                İptal
              </Button>
              <Button onClick={() => modalClose(false)}>{refModalType.current == 1 ? 'Alıştırmaya' : 'Teste'} Başla</Button>
            </div>
          </React.Fragment>
        }
      >
        <div>
          {refModalType.current == 1 &&
            <div>
              <p>Az sonra ekranda aşağıda gösterilen 4 farklı şekli art arda karışık bir şekilde göreceksin.</p>
              <p>Ekranda Büyük kare, Büyük daire ve Küçük daire şekillerini gördüğünde BAS yazan tuşa hızlıca basmalısın.</p>
              <p>Küçük kare görüyorsan ise hiçbir tuşa basma.</p>
              <p>Haydi bir alıştırma yapalım!</p>
            </div>
          }
          {refModalType.current == 2 &&
            <div>
              <p>Alıştırma bitti.</p>
              <p>Az önce yaptığın gibi, ekranda Büyük kare, Büyük daire ve Küçük daire şekillerini gördüğünde BAS yazan tuşa hızlıca basmalısın.</p>
              <p>Küçük kare görüyorsan ise hiçbir tuşa basma.</p>
              <p>Haydi teste başla!</p>
            </div>
          }

          <div style={{ flexDirection: 'column', textAlign: 'left' }}>
            <div className={'buyuk-kare'} style={{ height: '100px', width: '100px', margin: '30px' }}>
              {' '}
              <span style={{ left: '150px', top: '30px', position: 'relative', fontSize: '20px' }}>
                {' '}
                <b> &#8594; BAS</b>
              </span>
            </div>
            <div
              className={'buyuk-daire'}
              style={{ height: '100px', width: '100px', margin: '30px' }}
            >
              <span style={{ left: '150px', top: '30px', position: 'relative', fontSize: '20px' }}>
                {' '}
                <b> &#8594; BAS</b>
              </span>
            </div>
            <div
              className={'kucuk-daire'}
              style={{
                height: '40px',
                width: '40px',
                margin: '30px',
                position: 'relative',
                left: '30px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '100px',
                  left: '120px',
                  top: '5px',
                  position: 'relative',
                  fontSize: '20px',
                }}
              >
                {' '}
                <b> &#8594; BAS</b>
              </span>
            </div>
            <div
              className={'kucuk-kare'}
              style={{
                height: '40px',
                width: '40px',
                margin: '30px',
                position: 'relative',
                left: '30px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '200px',
                  left: '120px',
                  position: 'relative',
                  fontSize: '25px',
                  color: 'red',
                }}
              >
                {' '}
                <b> &#8594; BASMA</b>
              </span>
            </div>
          </div>
        </div>
      </Modal>


      {finished && refNextTest.current && (
        <div className="center" style={{ flexDirection: 'column' }}>
          <Button
            type="button"
            size="large"
            onClick={() => {
              history.push("/task" + refNextTest.current );
            }}
          >
            Sonraki Teste Geç
          </Button>
        </div>
      )}
      
      {finished && !refNextTest.current && (
        <div className="center" style={{ flexDirection: 'column' }}>
          Test sona erdi. Tebrikler.
        </div>
      )}

      {started && !blockStarted && (
        <div className="center" style={{ flexDirection: 'column' }}>
          <Button
            type="button"
            size="large"
            onClick={() => {
              setBlockStarted(true);
              refBlockStarted.current = true;
            }}
          >
            DEVAM ET
          </Button>
          <div style={{ position: 'fixed', top: '100px', left: '1px' }}>
            <Button
              type="button"
              size="xsmall"
              onClick={() => {
                cancelTest();
              }}
            >
              İPTAL
            </Button>
          </div>
        </div>
      )}

      {started && blockStarted && (
        <div className="center" style={{ flexDirection: 'column' }}>
          <div className={shape}></div>
          {!shape && <p style={{ fontSize: '70px' }}> + </p>}
          <div style={{ position: 'fixed', bottom: '100px' }}>
            <Button
              type="button"
              size="big"
              onClick={() => {
                recordClick();
              }}
            >
              BAS
            </Button>
          </div>

          <div style={{ position: 'fixed', top: '100px', left: '1px' }}>
            <Button
              type="button"
              size="xsmall"
              onClick={() => {
                cancelTest();
              }}
            >
              İPTAL
            </Button>
          </div>
        </div>
      )}
      {!started && !finished && (
        <Button
          type="button"
          size="large"
          onClick={() => {
            start();
          }}
        >
          Başlat
        </Button>
      )}
    </div>
  );
};

export default Task1;
