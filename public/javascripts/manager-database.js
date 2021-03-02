var firebase = require("firebase");


  const firebaseConfig = {
    apiKey: "AIzaSyD_XMurrtCwx22kqjj_JlFJsG5mNZjmFkE",
    authDomain: "coinmarketcapcotacao.firebaseapp.com",
    projectId: "coinmarketcapcotacao",
    storageBucket: "coinmarketcapcotacao.appspot.com",
    messagingSenderId: "294894176370",
    appId: "1:294894176370:web:c72a1da2b421a15cce9aeb",
    measurementId: "G-P43K20H51B"
  };

  firebase.initializeApp(firebaseConfig);

  // Get a reference to the database service
  var database = firebase.database();

  function salvaCotacao( dados ){
    console.log(dados)

    firebase.database().ref('cotacao/').set({dados});
  }


  module.exports = salvaCotacao