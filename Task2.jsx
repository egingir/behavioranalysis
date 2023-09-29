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

const Task2 = () => {
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
  const [countDownDuration, setCountDownDuration] = useState(10);
  const [showModal, setShowModal] = useState(false);
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
  const refCurrentBlock = useRef(0);
  const refAllowClick = useRef(false);
  const refShowModal = useRef(false);
  const refCountDownText = useRef('');
  const refBlockStarted = useRef(false);
  const refTest = useRef(1);
  const refPrevLetter = useRef('');
  const refPrev2Letter = useRef('');
  const refNextTest = useRef(null);
  const refModalType = useRef(1);

  //Not in reset
  const stopTestREF = useRef(false);
  const [stopTest, setStopTest] = useState(false);
  const [openNotRegistedSnack, setOpenNotRegistedSnack] = useState(false);
  const [openNotInternetSnack, setOpenNotInternetSnack] = useState(false);

  let yapLimit = 12;
  let yapmaLimit = 28;

  const yapLetter = 'N';
  const yapmaLetters = [
    'B',
    'C',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'P',
    'R',
    'S',
    'T',
    'V',
    'Y',
    'Z'
  ];

  const allLetters = [
    'B',
    'C',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'R',
    'S',
    'T',
    'V',
    'Y',
    'Z'
  ];

  const getYap = (isPractice = false) => {
    let yap = null;

    if(isPractice){
      yapLimit = 6;
      yapmaLimit = 14;
    }
    else
    {
      yapLimit = 12;
      yapmaLimit = 28;
    }

    if(refTest.current == 2 && refPrevLetter.current == '')
    {
      yap = 'yapma';
      yapmaCounter.current++;
      return yap;
    }

    if(refTest.current == 3 && (refPrevLetter.current == '' || refPrev2Letter.current == ''))
    {
      yap = 'yapma';
      yapmaCounter.current++;
      return yap;
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

    if (random < 0.3) {
      yap = 'yap';
      yapCounter.current++;
    } else {
      yap = 'yapma';
      yapmaCounter.current++;
    }

    return yap;
  };


  const getLetter = (type) => {
    let extractedLetter = null;

    if (type == 'yap') {
      extractedLetter = yapLetter;
    } else {
      const random = Math.floor(Math.random() * yapmaLetters.length);
      extractedLetter = yapmaLetters[random];
    }

    return extractedLetter;
  };


  const getLetter2 = (type) => {
    let extractedLetter = null;

    if (type == 'yap') {
      extractedLetter = refPrevLetter.current;
    } else {
      while(true){
      const random = Math.floor(Math.random() * allLetters.length);
      const currentLetter = allLetters[random];

      if(currentLetter !== refPrevLetter.current)
      {
        extractedLetter = currentLetter;
        break;
      }
    }
    }

    refPrevLetter.current = extractedLetter;
    return extractedLetter;
  };


  const getLetter3 = (type) => {
    let extractedLetter = null;

    if (type == 'yap') {
      extractedLetter = refPrev2Letter.current;
    } else {
      while(true){
      const random = Math.floor(Math.random() * allLetters.length);
      const currentLetter = allLetters[random];

      if(currentLetter !== refPrev2Letter.current)
      {
        extractedLetter = currentLetter;
        break;
      }
    }
    }

    refPrev2Letter.current = refPrevLetter.current;
    refPrevLetter.current = extractedLetter;
    return extractedLetter;
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

  const modalClose = (stop) =>{

    if(stop)
    {
      setStopTest(true);
      stopTestREF.current = true;
    }
    
        setShowModal(false);
        refShowModal.current = false;
      }

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
      tepki = 'doğru';
      sonuc = 'false alarm';
    }

    let testtipi = 'yap';
    if(refTest.current == 1)
    {
      testtipi = 'N-0-Geri';
    }

    if(refTest.current == 2)
    {
      testtipi = 'N-1-Geri';
    }

    if(refTest.current == 3)
    {
      testtipi = 'N-2-Geri';
    }

    let beklenen = refYap.current == 'yap' ? '1' : '0';

    const result = {
      uyarici: testtipi,
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
    refCurrentBlock.current = 0;
    refAllowClick.current = false;
    refShowModal.current = false;
    refCountDownText.current = '';
    refBlockStarted.current = false;
    refPrevLetter.current = '';
    refPrev2Letter.current = '';
    refModalType.current = 1;

    const currentTestSirasi = '2';
    const testSirasi = store.testRegisters.testsirasi.split('-');

    for (let i = 0; i < testSirasi.length; i++) {
      const element = testSirasi[i];
      if(element == '2')
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
      tip: 'Harf N (2)',
      katilimcino: registerInfo.katilimcino,
      testsirasi: registerInfo.testsirasi,
      sinif: registerInfo.sinif,
      yas: registerInfo.yas,
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
      } catch (err) {}
    }

    // refResults.current.forEach(async (result) => {
    //   result.behaviortest = behaviorTestId;

    //   try {
    //     await sendRequest(
    //       `${process.env.REACT_APP_BACKEND_URL}/${behaviorEndpoint}`,
    //       'POST',
    //       JSON.stringify(result),
    //       {
    //         'Content-Type': 'application/json',
    //         Authorization: 'Bearer ' + auth.token,
    //       }
    //     );
    //   } catch (err) {}
    // });

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
    refTest.current = 1;

    const registerInfo = store.testRegisters;

    //Open it in production
    if (!registerInfo || !registerInfo.registered) {
      setOpenNotRegistedSnack(true);
      return;
    }

    reset();

     //#region Modal Screen
     refModalType.current = 1;
     refShowModal.current = true;
     setShowModal(true);
 
     while(refShowModal.current)
     {
       await new Promise(r => setTimeout(r, 10));
     }
 
     if (stopTestREF.current) {
       stopTestREF.current = false;
       setStopTest(false);
       reset();
       return;
     }
     //#endregion Modal Screen


     reset();
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
     await sleep(2500);
     while (true) {
       if (stopTestREF.current) {
         stopTestREF.current = false;
         setStopTest(false);
         reset();
         return;
       }
 
       let currentYap = getYap(true);
       if (currentYap == null) {
           reset();
          // setFinished(true);
           break;
         }
       
       const currentShape = getLetter(currentYap);
       refYap.current = currentYap;
       refShape.current = currentShape;
       refClicked.current = false;
     
       setShape(currentShape);
       refAllowClick.current = true;
       refStartTime.current = performance.now();
       await sleep(500);
       setShape(null);
       await sleep(2500);
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
    refCurrentBlock.current = 1;
    refBlockStarted.current = true;
    await sleep(2500);
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
          while(!refBlockStarted.current)
          {
            await new Promise(r => setTimeout(r, 1000));
          }
          currentYap = getYap(false);
        } else if (refCurrentBlock.current == 2) {
          //await recordResults();
          reset();
          //setFinished(true);
          break;
        }
      }

      const currentShape = getLetter(currentYap);
      refYap.current = currentYap;
      refShape.current = currentShape;
      refClicked.current = false;
      setShape(currentShape);
      refAllowClick.current = true;
      refStartTime.current = performance.now();
      await sleep(500);
      setShape(null);
      await sleep(2500);
      refAllowClick.current = false;
      saveResult();
    }


//#region 2. test
refModalType.current = 1;
  refTest.current = 2;
  //#region Modal Screen
  refShowModal.current = true;
  setShowModal(true);

  while(refShowModal.current)
  {
    await new Promise(r => setTimeout(r, 10));
  }

  if (stopTestREF.current) {
    stopTestREF.current = false;
    setStopTest(false);
    reset();
    return;
  }
  //#endregion Modal Screen

  reset();
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
  await sleep(2500);
  while (true) {
    if (stopTestREF.current) {
      stopTestREF.current = false;
      setStopTest(false);
      reset();
      return;
    }

    let currentYap = getYap(true);
    if (currentYap == null) {
        reset();
       // setFinished(true);
        break;
      }
    
    const currentShape = getLetter2(currentYap);
    refYap.current = currentYap;
    refShape.current = currentShape;
    refClicked.current = false;
  
    setShape(currentShape);
    refAllowClick.current = true;
    refStartTime.current = performance.now();
    await sleep(500);
    setShape(null);
    await sleep(2500);
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
 refCurrentBlock.current = 1;
 refBlockStarted.current = true;
 await sleep(2500);
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
       refPrevLetter.current = '';
       refPrev2Letter.current = '';
       setCountDownDuration(60);
       refCountDownText.current = 'Teste ara verildi...';
       setShowCountDown(true);
       await sleep(60000);
       setShowCountDown(false);
       while(!refBlockStarted.current)
       {
         await new Promise(r => setTimeout(r, 1000));
       }
       currentYap = getYap(false);
     } else if (refCurrentBlock.current == 2) {
       //await recordResults();
       reset();
     //  setFinished(true);
       break;
     }
   }

   const currentShape = getLetter2(currentYap);
   refYap.current = currentYap;
   refShape.current = currentShape;
   refClicked.current = false;
 
   setShape(currentShape);
   refAllowClick.current = true;
   refStartTime.current = performance.now();
   await sleep(500);
   setShape(null);
   await sleep(2500);
   refAllowClick.current = false;
   saveResult();
 }

//#endregion 2. test


//#region 3. test
refModalType.current = 1;
refTest.current = 3;
//#region Modal Screen
refShowModal.current = true;
setShowModal(true);

while(refShowModal.current)
{
  await new Promise(r => setTimeout(r, 10));
}

if (stopTestREF.current) {
  stopTestREF.current = false;
  setStopTest(false);
  reset();
  return;
}
//#endregion Modal Screen

reset();
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
await sleep(2500);
while (true) {
  if (stopTestREF.current) {
    stopTestREF.current = false;
    setStopTest(false);
    reset();
    return;
  }

  let currentYap = getYap(true);
  if (currentYap == null) {
      reset();
     // setFinished(true);
      break;
    }
  
  const currentShape = getLetter3(currentYap);
  refYap.current = currentYap;
  refShape.current = currentShape;
  refClicked.current = false;

  setShape(currentShape);
  refAllowClick.current = true;
  refStartTime.current = performance.now();
  await sleep(500);
  setShape(null);
  await sleep(2500);
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
refCurrentBlock.current = 1;
refBlockStarted.current = true;
await sleep(2500);
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
     refPrevLetter.current = '';
     refPrev2Letter.current = '';
     setCountDownDuration(60);
     refCountDownText.current = 'Teste ara verildi...';
     setShowCountDown(true);
     await sleep(60000);
     setShowCountDown(false);
     while(!refBlockStarted.current)
     {
       await new Promise(r => setTimeout(r, 1000));
     }
     currentYap = getYap(false);
   } else if (refCurrentBlock.current == 2) {
     await recordResults();
     reset();
     setFinished(true);
     break;
   }
 }

 const currentShape = getLetter3(currentYap);
 refYap.current = currentYap;
 refShape.current = currentShape;
 refClicked.current = false;

 setShape(currentShape);
 refAllowClick.current = true;
 refStartTime.current = performance.now();
 await sleep(500);
 setShape(null);
 await sleep(2500);
 refAllowClick.current = false;
 saveResult();
}

//#endregion 3. test

















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
      <div style={{ fontSize: "32px", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "-webkit-center" }}>
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
          <Button type="button" size="big" onClick={() => {}}>
            EVET
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
        onCancel={ () => modalClose(true)}
        footerClass="modal-footer"
        footer={
          <React.Fragment>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <Button danger onClick={ () => modalClose(true)}>İptal</Button>
            <Button onClick={() => modalClose(false)}>{refModalType.current == 1 ? 'Alıştırmaya' : 'Teste'} Başla</Button>
            </div>
          </React.Fragment>
        }
      >
      {refTest.current ==1 && refModalType.current == 1 &&
        (<div>
          <p>Az sonra ekranda art arda bazı harfler göreceksin. Eğer N harfini görürsen hızlıca EVET tuşuna bas.</p>
          <p>Diğer harflerde hiçbir tuşa basma.</p>
          <p>Haydi bir alıştırma yapalım!</p>
        <div style={{ flexDirection: 'column', textAlign: "left" }}>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>N <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b> &#8594; EVET</b></span></div>
        </div> </div>)
}
{refTest.current ==1 && refModalType.current == 2 &&
        (<div>
          <p>Alıştırma bitti.</p>
          <p>Az önce yaptığın gibi, ekranda N harfini gördüğünde EVET tuşuna bas. Diğerler harflerde basma.</p>
          <p>Haydi teste başla!</p>
        <div style={{ flexDirection: 'column', textAlign: "left" }}>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>N <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b> &#8594; EVET</b></span></div>
        </div> </div>)
}


      {refTest.current ==2 && refModalType.current == 1 &&
        (<div>
          <p>Az sonra ekranda art arda bazı harfler göreceksin. Arka arkaya iki kez aynı harfi görürsen EVET tuşuna basmalısın.
Bu harflerin hangisi olduğu önemli değil. İki kez art arda gördüğün her harf için mutlaka bas. Arka arkaya gelen
harfler birbirinden farklıysa hiçbir tuşa basma.</p>
          <p>Haydi alıştırma yapalım!</p>
        <div style={{ flexDirection: 'column', textAlign: "left" }}>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>R - R <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b> &#8594; EVET</b></span></div>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>P - R <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b style={{color:"red"}}> &#8594; BASMA</b></span></div>
        </div>
</div>     )  }


{refTest.current ==2 && refModalType.current == 2 &&
        (<div>
          <p>Alıştırma bitti.</p>
          <p>Az önce yaptığın gibi, art arda iki kez aynı harfi gördüğünde EVET tuşuna bas. Aynı harfi arka arkaya iki kez
görmediysen basma.</p>
          <p>Haydi teste başla!</p>
        <div style={{ flexDirection: 'column', textAlign: "left" }}>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>R - R <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b> &#8594; EVET</b></span></div>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>P - R <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b style={{color:"red"}}> &#8594; BASMA</b></span></div>
        </div>
</div>     )  }

      {refTest.current ==3 && refModalType.current == 1 &&
        (<div>
          <p>Az sonra ekranda art arda bazı harfler göreceksin. Ekranda gördüğün harf iki önce gördüğün harfle aynıysa EVET
tuşuna basmalısın. Bu harflerin hangisi olduğu önemli değil. Şimdi gördüğün ile iki önceki aynı ise mutlaka bas.
Ekranda gödrüğün harf iki önceki ile aynı değilse hiçbir tuşa basma.</p>
<p>Haydi alıştırma yapalım!</p>
        <div style={{ flexDirection: 'column', textAlign: "left" }}>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>P - R - P <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b> &#8594; EVET</b></span></div>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>P - P - P <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b> &#8594; EVET</b></span></div>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>P - P - R <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b style={{color:"red"}}> &#8594; BASMA</b></span></div>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>B - R - P <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b style={{color:"red"}}> &#8594; BASMA</b></span></div>
        </div>
</div>     )  }
{refTest.current ==3 && refModalType.current == 2 &&
        (<div>
          <p>Alıştırma bitti.</p>
          <p>Az önce yaptığın gibi, ekranda gördüğün harf ile iki öncesinde görmüş olduğun harf aynı ise EVET tuşuna bas.
Ekranda gödrüğün harf iki önceki ile aynı değilse hiçbir tuşa basma.</p>
<p>Haydi teste başla!</p>
        <div style={{ flexDirection: 'column', textAlign: "left" }}>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>P - R - P <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b> &#8594; EVET</b></span></div>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>P - P - P <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b> &#8594; EVET</b></span></div>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>P - P - R <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b style={{color:"red"}}> &#8594; BASMA</b></span></div>
        <div style={{ color: '#316cbe', fontSize: '5rem', margin: "30px" }}>B - R - P <span style={{left: "30px", top: "-20px", position: "relative", fontSize: "20px"}}> <b style={{color:"red"}}> &#8594; BASMA</b></span></div>
        </div>
</div>     )  }
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
              onClick={() => { setBlockStarted(true); refBlockStarted.current = true;} }
            >
              DEVAM ET
            </Button>
          <div style={{ position: 'fixed',top: '100px', left: '1px' }}>
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
          <div style={{ color: '#316cbe', fontSize: '20rem' }}>{shape}</div>
          { !shape && <p style={{fontSize: "70px"}}> + </p> }
          <div style={{ position: 'fixed', bottom: '100px' }}>
            <Button
              type="button"
              size="big"
              onClick={() => {
                recordClick();
              }}
            >
              EVET
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

export default Task2;
