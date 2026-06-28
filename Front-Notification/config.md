// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

&#x20; apiKey: "AIzaSyCqvjzALoYc58FdlQm0462VCXoRnsw0PIk",

&#x20; authDomain: "social-media-app-79e10.firebaseapp.com",

&#x20; projectId: "social-media-app-79e10",

&#x20; storageBucket: "social-media-app-79e10.firebasestorage.app",

&#x20; messagingSenderId: "208278841275",

&#x20; appId: "1:208278841275:web:bc15de8a6565896670c69e",

&#x20; measurementId: "G-7G1LKBNCF6"

};



// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const KeyPair = "BFvMtyjI260O_mQoke6ykK6CWIR1WcONBrrw-lC71LeqbkJdG7GNib9skUU3orr9nCDMm2CYrIi3Jf1nVf-NRlY"