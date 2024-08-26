//importing firebase
import { initializeApp } from 'firebase/app'
//must first initialize before using the getter funtions
import { 
  getAuth
 } from 'firebase/auth';
//import { getFirestore , collection, getDocs} from 'firebase/firestore';
import { getDatabase, ref, set, push } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYAkImqFcslBWLdbp7VdfRQ43WbbDORoE",
  authDomain: "locaterr-950d9.firebaseapp.com",
  databaseURL: "https://locaterr-950d9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "locaterr-950d9",
  storageBucket: "locaterr-950d9.appspot.com",
  messagingSenderId: "931310853629",
  appId: "1:931310853629:web:3fd474c7cb854e1a97cd94"
};


  //users
  //pass: test123
  //email: test123@mail.com
  //userID: Rv7rhAxIPSYNYeRC0jSLWgftWMl1

//Initialize Firebase appname: firebaseApp
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp)
    const user = auth.tenantId
    //const db = getFirestore(firebaseApp)
    const database = getDatabase(firebaseApp)
    const dbRef = ref(database);
    

//Detect Auth state
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     const uid = user.uid;
  //     console.log(uid)
  //     // ...
  //   } else {
  //     // User is signed out
  //     console.log("User is signed out", auth)
  //     // ...
  //   }
  // });

//


//write
  function writeUserData(
    usernameVal:string,
    emailVal:string,
    locationVal:string, 
    inputLatVal:string, 
    inputLngVal:string ) {
    console.log('write..')
      const postListRef = ref(database, 'posts');
      const newPostRef = push(postListRef);
      set(newPostRef, {
        username: usernameVal,
        email: emailVal,
        location : locationVal,
        inputlat: inputLatVal,
        inputlng: inputLngVal
      });
  }


function random(SomeNumber:number) {
  return SomeNumber;
}

export { writeUserData, random, dbRef};

