import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import React, { useEffect, useState, useContext, useCallback } from 'react';
 

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

export const getdB = () => {

     // Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrW9V2OUDzmKCF_kfEStmPDqhqajvOf-w",
    authDomain: "davranis-degerlendirme.firebaseapp.com",
    databaseURL: "https://davranis-degerlendirme-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "davranis-degerlendirme",
    storageBucket: "davranis-degerlendirme.appspot.com",
    messagingSenderId: "507291889964",
    appId: "1:507291889964:web:1d63021f19450ff8017c89"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  return db;
}

export const cinsiyetler = [
    { value: "Kız", label: "Kız" },
    { value: "Erkek", label: "Erkek" },
    { value: "Diğer", label: "Diğer" },
    { value: "Belirtilmemiş", label: "Belirtilmemiş" },
  ];

  export const testsiralari = [
    { value: "1-2-3", label: "1-2-3" },
    { value: "1-3-2", label: "1-3-2" },
    { value: "2-1-3", label: "2-1-3" },
    { value: "2-3-1", label: "2-3-1" },
    { value: "3-1-2", label: "3-1-2" },
    { value: "3-2-1", label: "3-2-1" },
  ];

  