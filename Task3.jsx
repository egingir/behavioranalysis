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
import { BreakfastDining, DoorBack } from '@mui/icons-material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { onValue, ref } from 'firebase/database';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../shared/components/UIElements/Modal';
import { useHistory } from "react-router-dom";
import { useEffect } from 'react';

const Task3 = () => {
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
  const [ustImage, setUstImage] = useState(null);
  const [altImage, setAltImage] = useState(null);
  const [nokta, setNokta] = useState(null);
  const [showFocus, setShowFocus] = useState(false);
  const [showNokta, setShowNokta] = useState(false);

  //ref related
  const refYap = useRef(null);
  const refShape = useRef(null);
  const refStartTime = useRef(0);
  const refClicked = useRef(false);
  const refClickedType = useRef(null);
  const refClickTime = useRef(0);
  const refResults = useRef([]);
  const refCurrentBlock = useRef(0);
  const refAllowClick = useRef(0);
  const refShowModal = useRef(false);
  const refCountDownText = useRef('');
  const refNextTest = useRef(null);
  const refModalType = useRef(1);
  const refNokta = useRef('');

  const notr_uyumlu_counter = useRef(0);
  const notr_uyumsuz_counter = useRef(0);
  const olumlu_uyumlu_counter = useRef(0);
  const olumlu_uyumsuz_counter = useRef(0);
  const olumsuz_uyumlu_counter = useRef(0);
  const olumsuz_uyumsuz_counter = useRef(0);

  const woman_counter = useRef(0);
  const man_counter = useRef(0);


  useEffect(() => {
    cacheImages();
  },[]);

  const cacheImages = async () =>{


    const srcArray = [
      'm_h_5.jpg','m_h_4.jpg','m_h_3.jpg','m_h_2.jpg','m_h_1.jpg',
      'w_h_5.jpg','w_h_4.jpg','w_h_3.jpg','w_h_2.jpg','w_h_1.jpg',
      'm_a_5.jpg','m_a_4.jpg','m_a_3.jpg','m_a_2.jpg','m_a_1.jpg',
      'w_a_5.jpg','w_a_4.jpg','w_a_3.jpg','w_a_2.jpg','w_a_1.jpg',
      'm_n_5.jpg','m_n_4.jpg','m_n_3.jpg','m_n_2.jpg','m_n_1.jpg',
      'w_n_5.jpg','w_n_4.jpg','w_n_3.jpg','w_n_2.jpg','w_n_1.jpg',
  ];
const promises = await srcArray.map((src) => {
return new Promise(function (resolve, reject) {
  const img = new Image();
  img.src = '/images/faces/' + src;
  img.onload = resolve();
  img.onerror = reject();
});
});
     await Promise.all(promises);

}

  //Not in reset
  const stopTestREF = useRef(false);
  const [stopTest, setStopTest] = useState(false);
  const [openNotRegistedSnack, setOpenNotRegistedSnack] = useState(false);
  const [openNotInternetSnack, setOpenNotInternetSnack] = useState(false);

  let duyguLimit = 40;
  let sexLimit = 120;
  //const yapmaLimit = 14;

  const getDuygu = (isPractice = false) => {
    let duygu = null;

    if (isPractice) {
      duyguLimit = 4;
      sexLimit = 12;
    }
    else {
      duyguLimit = 40;
      sexLimit = 120;
    }

    if (
      notr_uyumlu_counter.current == duyguLimit &&
      notr_uyumsuz_counter.current == duyguLimit &&
      olumlu_uyumlu_counter.current == duyguLimit &&
      olumlu_uyumsuz_counter.current == duyguLimit &&
      olumsuz_uyumlu_counter.current == duyguLimit &&
      olumsuz_uyumsuz_counter.current == duyguLimit
    ) {
      return null;
    }

    if (
      notr_uyumlu_counter.current < duyguLimit &&
      notr_uyumsuz_counter.current == duyguLimit &&
      olumlu_uyumlu_counter.current == duyguLimit &&
      olumlu_uyumsuz_counter.current == duyguLimit &&
      olumsuz_uyumlu_counter.current == duyguLimit &&
      olumsuz_uyumsuz_counter.current == duyguLimit
    ) {
      notr_uyumlu_counter.current++;
      duygu = 'notr - uyumlu';
      return duygu;
    }

    if (
      notr_uyumlu_counter.current == duyguLimit &&
      notr_uyumsuz_counter.current < duyguLimit &&
      olumlu_uyumlu_counter.current == duyguLimit &&
      olumlu_uyumsuz_counter.current == duyguLimit &&
      olumsuz_uyumlu_counter.current == duyguLimit &&
      olumsuz_uyumsuz_counter.current == duyguLimit
    ) {
      notr_uyumsuz_counter.current++;
      duygu = 'notr - uyumsuz';
      return duygu;
    }

    if (
      notr_uyumlu_counter.current == duyguLimit &&
      notr_uyumsuz_counter.current == duyguLimit &&
      olumlu_uyumlu_counter.current < duyguLimit &&
      olumlu_uyumsuz_counter.current == duyguLimit &&
      olumsuz_uyumlu_counter.current == duyguLimit &&
      olumsuz_uyumsuz_counter.current == duyguLimit
    ) {
      olumlu_uyumlu_counter.current++;
      duygu = 'olumlu - uyumlu';
      return duygu;
    }

    if (
      notr_uyumlu_counter.current == duyguLimit &&
      notr_uyumsuz_counter.current == duyguLimit &&
      olumlu_uyumlu_counter.current == duyguLimit &&
      olumlu_uyumsuz_counter.current < duyguLimit &&
      olumsuz_uyumlu_counter.current == duyguLimit &&
      olumsuz_uyumsuz_counter.current == duyguLimit
    ) {
      olumlu_uyumsuz_counter.current++;
      duygu = 'olumlu - uyumsuz';
      return duygu;
    }

    if (
      notr_uyumlu_counter.current == duyguLimit &&
      notr_uyumsuz_counter.current == duyguLimit &&
      olumlu_uyumlu_counter.current == duyguLimit &&
      olumlu_uyumsuz_counter.current == duyguLimit &&
      olumsuz_uyumlu_counter.current < duyguLimit &&
      olumsuz_uyumsuz_counter.current == duyguLimit
    ) {
      olumsuz_uyumlu_counter.current++;
      duygu = 'olumsuz - uyumlu';
      return duygu;
    }

    if (
      notr_uyumlu_counter.current == duyguLimit &&
      notr_uyumsuz_counter.current == duyguLimit &&
      olumlu_uyumlu_counter.current == duyguLimit &&
      olumlu_uyumsuz_counter.current == duyguLimit &&
      olumsuz_uyumlu_counter.current == duyguLimit &&
      olumsuz_uyumsuz_counter.current < duyguLimit
    ) {
      olumsuz_uyumsuz_counter.current++;
      duygu = 'olumsuz - uyumsuz';
      return duygu;
    }

    while (true) {
      const random = Math.random();
      if (random < 0.16666666666666666 && notr_uyumlu_counter.current < duyguLimit) {
        duygu = 'notr - uyumlu';
        notr_uyumlu_counter.current++;
      } else if (random < 0.3333333333333333 && notr_uyumsuz_counter.current < duyguLimit) {
        duygu = 'notr - uyumsuz';
        notr_uyumsuz_counter.current++;
      } else if (random < 0.5 && olumlu_uyumlu_counter.current < duyguLimit) {
        duygu = 'olumlu - uyumlu';
        olumlu_uyumlu_counter.current++;
      } else if (random < 0.6666666666666666 && olumlu_uyumsuz_counter.current < duyguLimit) {
        duygu = 'olumlu - uyumsuz';
        olumlu_uyumsuz_counter.current++;
      } else if (random < 0.8333333333333333 && olumsuz_uyumlu_counter.current < duyguLimit) {
        duygu = 'olumsuz - uyumlu';
        olumsuz_uyumlu_counter.current++;
      } else if (random >= 0.8333333333333333 && olumsuz_uyumsuz_counter.current < duyguLimit) {
        duygu = 'olumsuz - uyumsuz';
        olumsuz_uyumsuz_counter.current++;
      }

      if (duygu) {
        break;
      }
    }

    const total = notr_uyumlu_counter.current + notr_uyumsuz_counter.current + olumlu_uyumlu_counter.current + olumlu_uyumsuz_counter.current + olumsuz_uyumlu_counter.current + olumsuz_uyumsuz_counter.current;

    return duygu;
  };

  const getImages = (type) => {
    let extractedImages = null;

    //GEt a random number between 1 and 5
    const notr_image_number = Math.floor(Math.random() * 5) + 1;
    let notr_sex_choice = null;
    if (woman_counter.current < sexLimit && man_counter.current == sexLimit) {
      notr_sex_choice = 'w';
      woman_counter.current++;
      woman_counter.current++;
    } else if (woman_counter.current == sexLimit && man_counter.current < sexLimit) {
      notr_sex_choice = 'm';
      man_counter.current++;
      man_counter.current++;
    } else {
      const random = Math.random();
      if (random < 0.5) {
        notr_sex_choice = 'w';
        woman_counter.current++;
        woman_counter.current++;
      } else {
        notr_sex_choice = 'm';
        man_counter.current++;
        man_counter.current++;
      }
    }

    const other_image_number = notr_image_number;
    let other_sex_choice = notr_sex_choice;

    // const other_image_number = Math.floor(Math.random() * 5) + 1;
    // let other_sex_choice = null;
    // if (woman_counter.current < sexLimit && man_counter.current == sexLimit) {
    //   other_sex_choice = 'w';
    //   woman_counter.current++;
    // } else if (woman_counter.current == sexLimit && man_counter.current < sexLimit) {
    //   other_sex_choice = 'm';
    //   man_counter.current++;
    // } else {
    //   const random = Math.random();
    //   if (random < 0.5) {
    //     other_sex_choice = 'w';
    //     woman_counter.current++;
    //   } else {
    //     other_sex_choice = 'm';
    //     man_counter.current++;
    //   }
    // }

    let image1 = null;
    let image2 = null;

    image1 = notr_sex_choice + '_n_' + notr_image_number + '.jpg';

    if (type == 'notr - uyumlu' || type == 'notr - uyumsuz') {
      image2 = other_sex_choice + '_n_' + other_image_number + '.jpg';
    } else if (type == 'olumlu - uyumlu' || type == 'olumlu - uyumsuz') {
      image2 = other_sex_choice + '_h_' + other_image_number + '.jpg';
    } else if (type == 'olumsuz - uyumlu' || type == 'olumsuz - uyumsuz') {
      image2 = other_sex_choice + '_a_' + other_image_number + '.jpg';
    }

    return { notr: image1, other: image2 };
  };

  const checkYap = () => {
    // refYap.current = currentYap;
    // refShape.current = currentShape;
  };

  const recordClick = (type) => {
    if (!refClicked.current && refAllowClick.current) {
      {
        refClicked.current = true;
        refClickedType.current = type;
        refClickTime.current = performance.now();
      }
    }
  };

  const modalClose = (stop) => {

    if (stop) {
      setStopTest(true);
      stopTestREF.current = true;
    }

    setShowModal(false);
    refShowModal.current = false;
  }

  const saveResult = async (currentImages) => {
    // const response = await fetch('https://davranis-degerlendirme-default-rtdb.europe-west1.firebasedatabase.app/results.json');

    let responseTime = 0;

    if (refClicked.current) {
      responseTime = Math.floor(refClickTime.current - refStartTime.current);
    }

   
    let tepki = 'yanlış';
    let sonuc = '';




    if (refClicked.current && refClickedType.current == refNokta.current) {
      tepki = 'doğru';
      sonuc = 'hit';
    }
    if (refClicked.current && refClickedType.current !== refNokta.current) {
      tepki = 'yanlış';
      sonuc = 'false alarm';
    }
    if (!refClicked.current) {
      tepki = 'yanlış';
      sonuc = 'miss';
    }



    const result = {
      uyarici: refYap.current,
      sekil: 'Nötr: ' + currentImages.notr + ', Diğer: ' + currentImages.other,
      beklenen: refYap.current.includes('uyumlu') ? 'Diğer ('+ refNokta.current +')' : 'Nötr ('+refNokta.current+')',
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
    setUstImage(null);
    setAltImage(null);
    setNokta(null);
    setShowFocus(false);
    setShowNokta(false);

    //ref related
    refYap.current = null;
    refShape.current = null;
    refStartTime.current = 0;
    refClicked.current = false;
    refClickTime.current = 0;
    refResults.current = [];
    notr_uyumlu_counter.current = 0;
    notr_uyumsuz_counter.current = 0;
    olumlu_uyumlu_counter.current = 0;
    olumlu_uyumsuz_counter.current = 0;
    olumsuz_uyumlu_counter.current = 0;
    olumsuz_uyumsuz_counter.current = 0;
    refCurrentBlock.current = 0;
    refClickedType.current = null;
    refAllowClick.current = false;
    refShowModal.current = false;
    refCountDownText.current = '';
    refModalType.current = 1;
    refNokta.current = '';

    const currentTestSirasi = '3';
    const testSirasi = store.testRegisters.testsirasi.split('-');

    for (let i = 0; i < testSirasi.length; i++) {
      const element = testSirasi[i];
      if (element == '3') {
        if (i !== testSirasi.length - 1) {
          refNextTest.current = testSirasi[i + 1];
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
      tip: 'Görsel Nokta (3)',
      yas: registerInfo.yas,
      katilimcino: registerInfo.katilimcino,
      testsirasi: registerInfo.testsirasi,
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
    // reset();
    setStopTest(true);
    stopTestREF.current = true;
  };

  const start = async () => {

    if(navigator.onLine === false){
      setOpenNotInternetSnack(true);
      return;
    }

    const registerInfo = store.testRegisters;

    //Open in production
    if (!registerInfo || !registerInfo.registered) {
      setOpenNotRegistedSnack(true);
      return;
    }

    reset();


    //#region Modal Screen
    refModalType.current = 1;
    refShowModal.current = true;
    setShowModal(true);

    while (refShowModal.current) {
      await new Promise(r => setTimeout(r, 10));
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
    while (true) {
      if (stopTestREF.current) {
        stopTestREF.current = false;
        setStopTest(false);
        reset();
        return;
      }

      let currentDuygu = getDuygu(true);
      if (currentDuygu == null) {
        reset();
        //  setFinished(true);
        break;
        // }
      }

      setShowFocus(true);
      await sleep(700);
      setShowFocus(false);
      await sleep(50);

      const currentImages = getImages(currentDuygu);
      const sans = Math.floor(Math.random() * 2) == 0; // 0 or 1

      if (sans) {
        setUstImage(currentImages.notr);
        setAltImage(currentImages.other);

        if (currentDuygu.includes('uyumsuz')) {
          setNokta('üst');
          refNokta.current = 'üst';
        } else {
          setNokta('alt');
          refNokta.current = 'alt';
        }
      } else {
        setUstImage(currentImages.other);
        setAltImage(currentImages.notr);
        if (currentDuygu.includes('uyumsuz')) {
          setNokta('alt');
          refNokta.current = 'alt';
        } else {
          setNokta('üst');
          refNokta.current = 'üst';
        }
      }

     
      

      refYap.current = currentDuygu;
      refClicked.current = false;
      refClickedType.current = null;
      await sleep(500);
      refAllowClick.current = true;
      refStartTime.current = performance.now();
      setUstImage(null);
      setAltImage(null);
      setShowNokta(true);
      await sleep(1000);
      setShowNokta(false);
      refAllowClick.current = false;
    }

    //#region Modal Screen
    refModalType.current = 2;
    refShowModal.current = true;
    setShowModal(true);

    while (refShowModal.current) {
      await new Promise(r => setTimeout(r, 10));
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

    setShowCountDown(false);
    setStarted(true);
    refCurrentBlock.current = 1;

    while (true) {
      if (stopTestREF.current) {
        stopTestREF.current = false;
        setStopTest(false);
        reset();
        return;
      }

      let currentDuygu = getDuygu(false);
      if (currentDuygu == null) {
        // if (refCurrentBlock.current == 1) {
        //   notr_uyumlu_counter.current = 0;
        //   notr_uyumsuz_counter.current = 0;
        //   olumlu_uyumlu_counter.current = 0;
        //   olumlu_uyumsuz_counter.current = 0;
        //   olumsuz_uyumlu_counter.current = 0;
        //   olumsuz_uyumsuz_counter.current = 0;
        //   refCurrentBlock.current = 2;
        //   setCountDownDuration(120);
        //   setShowCountDown(true);
        //   await sleep(120000);
        //   setShowCountDown(false);
        //   currentDuygu = getDuygu();
        // } else if (refCurrentBlock.current == 2) {
        //   notr_uyumlu_counter.current = 0;
        //   notr_uyumsuz_counter.current = 0;
        //   olumlu_uyumlu_counter.current = 0;
        //   olumlu_uyumsuz_counter.current = 0;
        //   olumsuz_uyumlu_counter.current = 0;
        //   olumsuz_uyumsuz_counter.current = 0;
        //   refCurrentBlock.current = 3;
        //   setCountDownDuration(120);
        //   setShowCountDown(true);
        //   await sleep(120000);
        //   setShowCountDown(false);
        //   currentDuygu = getDuygu();
        // } else if (refCurrentBlock.current == 3) {
        //   notr_uyumlu_counter.current = 0;
        //   notr_uyumsuz_counter.current = 0;
        //   olumlu_uyumlu_counter.current = 0;
        //   olumlu_uyumsuz_counter.current = 0;
        //   olumsuz_uyumlu_counter.current = 0;
        //   olumsuz_uyumsuz_counter.current = 0;
        //   refCurrentBlock.current = 4;
        //   setCountDownDuration(120);
        //   setShowCountDown(true);
        //   await sleep(120000);
        //   setShowCountDown(false);
        //   currentDuygu = getDuygu();
        // } else if (refCurrentBlock.current == 4) {
        await recordResults();
        reset();
        setFinished(true);
        return;
        // }
      }

      setShowFocus(true);
      await sleep(750);
      setShowFocus(false);

      const currentImages = getImages(currentDuygu);
      const sans = Math.floor(Math.random() * 2) == 0; // 0 or 1

      if (sans) {
        setUstImage(currentImages.notr);
        setAltImage(currentImages.other);

        if (currentDuygu.includes('uyumsuz')) {
          setNokta('üst');
          refNokta.current = 'üst';
        } else {
          setNokta('alt');
          refNokta.current = 'alt';
        }
      } else {
        setUstImage(currentImages.other);
        setAltImage(currentImages.notr);
        if (currentDuygu.includes('uyumsuz')) {
          setNokta('alt');
          refNokta.current = 'alt';
        } else {
          setNokta('üst');
          refNokta.current = 'üst';
        }
      }

      refYap.current = currentDuygu;
      refClicked.current = false;
      refClickedType.current = null;
      await sleep(500);
      refAllowClick.current = true;
      refStartTime.current = performance.now();
      setUstImage(null);
      setAltImage(null);
      setShowNokta(true);
      await sleep(1000);
      setShowNokta(false);
      refAllowClick.current = false;
      saveResult(currentImages);
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
        <div style={{ position: 'fixed', top: '503px', right: '50px' }}>
          <Button type="button" onClick={() => { }}>
            <div className="arrow-up"></div>
          </Button>
        </div>

        <div style={{ position: 'fixed', top: '633px', right: '50px' }}>
          <Button type="button" onClick={() => { }}>
            <div className="arrow-down"></div>
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
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Button danger onClick={() => modalClose(true)}>İptal</Button>
              <Button onClick={() => modalClose(false)}>{refModalType.current == 1 ? 'Alıştırmaya' : 'Teste'} Başla</Button>
            </div>
          </React.Fragment>
        }
      >
        {refModalType.current == 1 &&
          <div>
            <p>Az sonra ekranın tam ortasında bir artı işareti göreceksin. Bunun altında ve üstüne birer yüz fotoğrafı olacak. Bu
              yüz fotoğraflarına dikkat etmene gerek yok. Fotoğraflardan sonra altta veya üstte bir nokta işareti göreceksin.
              Nokta üstte ise ÜST OK tuşuna, altta ise ALT OK tuşuna basmalısın.</p>
            <p>Lütfen noktanın nerede çıktığına dikkat et.</p>
            <p>Mümkün olduğunca hızlı olmaya çalış.</p>
            <p>Haydi alıştırma yapalım!</p>
          </div>
        }
         {refModalType.current == 2 &&
          <div>
            <p>Az önce yaptığın gibi, ekranın altında veya üstündeki karelerin içinde bir nokta göreceksin. Bu nokta altta ise ALT
OK, üstte ise ÜST OK tuşuna bas.</p>
            <p>Fotoğraflara dikkat etmene gerek yok.</p>
            <p>Mümkün olduğunca hızlı olmaya çalış.</p>
            <p>Haydi teste başla!</p>
          </div>
        }
      </Modal>

      {finished && refNextTest.current && (
        <div className="center" style={{ flexDirection: 'column' }}>
          <Button
            type="button"
            size="large"
            onClick={() => {
              history.push("/task" + refNextTest.current);
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

      {started && (
        <div className="center" style={{ flexDirection: 'column', left: '-100px' }}>
          <div className="uyarici-kare" style={{ position: 'fixed', top: '230px' }}></div>
          <div className="uyarici-kare" style={{ position: 'fixed', top: '634px' }}></div>
          <p style={{ position: 'fixed', fontSize: "70px", top: '480px' }}> + </p>
          {showNokta && nokta == 'üst' && (
            <div className="center">
              <div className="uyarici-daire" style={{ position: 'fixed', top: '380px' }}></div>
            </div>
          )}
          {showNokta && nokta == 'alt' && (
            <div className="center">
              <div className="uyarici-daire" style={{ position: 'fixed', top: '775px' }}></div>
            </div>
          )}

          {ustImage && altImage && (
            <div style={{ top: '240px', position: 'fixed' }}>
              <div style={{ top: '-2px', position: 'relative' }}>
                <img
                  src={`/images/faces/${ustImage}`}
                  style={{ width: '253px', height: '325px' }}
                />
              </div>
              <div style={{ top: '72px', position: 'relative' }}>
                <img
                  src={`/images/faces/${altImage}`}
                  style={{ width: '253px', height: '325px' }}
                />
              </div>
            </div>
          )}
          <div style={{ color: '#316cbe', fontSize: '20rem' }}>{shape}</div>

          <div style={{ position: 'fixed', top: '503px', right: '50px' }}>
            <Button
              type="button"
              // size="huge"
              onClick={() => {
                recordClick('üst');
              }}
            >
              <div className="arrow-up"></div>
            </Button>
          </div>

          <div style={{ position: 'fixed', top: '633px', right: '50px' }}>
            <Button
              type="button"
              // size="huge"
              onClick={() => {
                recordClick('alt');
              }}
            >
              <div className="arrow-down"></div>
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

export default Task3;
