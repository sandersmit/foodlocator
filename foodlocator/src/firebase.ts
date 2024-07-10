//importing firebase
import { initializeApp } from 'firebase/app'
//must first initialize before using the getter funtions
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//import { getFirestore , collection, getDocs} from 'firebase/firestore';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
    //add configs here
  };

//Initialize Firebase appname: firebaseApp
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp)
    //const db = getFirestore(firebaseApp)
    const database = getDatabase(firebaseApp)

//Detect Auth state
onAuthStateChanged(auth, user =>{
    if (user != null) {
        console.log('logged in')
    } else {
        console.log('no user')
    }
})

//write
function writeUserData(usernameVal,emailVal,locationVal ) {
   console.log('write..')
    set(ref(database), {
      username: usernameVal,
      email: emailVal,
      location : locationVal
    });
  }
  //writeUserData()
//read
function readUserData(){
  const starCountRef = ref(database);
onValue(starCountRef, (snapshot) => {
const dbdata = snapshot.val();
console.log('dbdata',dbdata)
return dbdata
});
}

export { writeUserData, readUserData};

