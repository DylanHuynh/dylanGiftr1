
    var interestIndex = 1;
    let interestArray = [];
    let currentUid;
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAMRm69bulBYsSReP1DOXLex61JgPUYFtw",
        authDomain: "dylangiftr.firebaseapp.com",
        databaseURL: "https://dylangiftr.firebaseio.com",
        projectId: "dylangiftr",
        storageBucket: "dylangiftr.appspot.com",
        messagingSenderId: "786271730811",
        appId: "1:786271730811:web:0eed0ef6143e24431eb6de"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);



    //Get elements
    // const txtEmail = document.getElementById('txtEmail');
    // const txtPassword = document.getElementById('txtPassword');
    // const btnLogin = document.getElementById('btnLogin');
    // const btnSignUp = document.getElementById('btnSignUp');
    // const btnLogout = document.getElementById('btnLogout');

    //SECTION: Login Events

        window.onload = () => {
            inApp();

        }

        function loginClick() {
            //Get email and password
            const email = document.getElementById('txtEmail').value;
            const pass = document.getElementById('txtPassword').value;
            const auth = firebase.auth();
            //Sign in
        const promise =  auth.signInWithEmailAndPassword(email,pass);
        //Catch errors
        promise.then(user => console.log(user));
        promise.catch(e => console.log(e.message));
        }

        function signUpClick() {
            // Get email and pass
            // TODO: Check for real EMAIL
            const email = document.getElementById('txtEmail').value;
            const pass = document.getElementById('txtPassword').value;
            const auth = firebase.auth();
            // Sign up
            const promise = auth.createUserWithEmailAndPassword(email,pass);
            promise.then(user => console.log(user));
            promise.catch(e => console.log(e.message));
        }

        function logOutClick() {
            firebase.auth().signOut();
        }

        function inApp() {
            //Add a realtime listener
            const auth = firebase.auth();
            const promise = auth.onAuthStateChanged(firebaseUser => {
                if (firebaseUser) {
                    console.log(firebaseUser);
                } else {
                    console.log('not logged in');
                }
                currentUid = firebaseUser.uid;
                writeUserData(firebaseUser.uid,firebaseUser.email);
                if (interestArray!=null) {
                    writeUserInterest(currentUid,interestArray);
                    interestArray=[];
                }
            });

        }

    //SECTION: Adding Interests
    function submitInfo() {
        var interest = document.getElementById('interest');
        var interestArray = separateInterests(interest.value);
    }

    function separateInterests(interestList) {
        var start = 0;
        var end;
        var interestArray = [];
        for(var i = 0; i < interestList.length; i++) {
            if (interestList.substring(i,i+1)===",") {
                end = i;
                interestArray.push(interestList.substring(start,end));
                start=end+1;
            }
            if ( i == interestList.length-1) {
                interestArray.push(interestList.substring(start,i+1))
            }
        }
        return interestArray;
    }

    const preObject = document.getElementById('object');
    const dbRefObject = firebase.database().ref().child("Object");
    dbRefObject.on('value',snap => console.log(snap.val()));

    function writeUserData(userId, email){
        console.log("userId");
        firebase.database().ref("users/" + userId).set({
            email: email,
            interests: "empty"
        });
        firebase.database().ref("users/" + userId).child("email").on("value", snap => {
          console.log("database email: " + snap.val());

        });
      }
    function writeUserInterest(userId, interests){
        for (var i = 0 ; i < interests.length;i++) {
            firebase.database().ref("users/" + userId +"/interests").push(interests[i]);
        }
    }

    function setInterests() {

        let interestInputArray = document.getElementsByClassName('interestInput');
        for (const element of interestInputArray) {
            console.log(element.value);
            interestArray.push(element.value);
        }
        console.log(interestArray);

        inApp();
    // separateInterests(interestList);
    }

    function appendInterest() {
      lastInterestBlock = document.getElementsByClassName("interest")[document.getElementsByClassName("interest").length-1];
      lastInterestBlock.innerHTML += '<div class="interest"><input class="interestInput" type="text" id="interest'+interestIndex+'"></div>';
      interestIndex++;
      console.log(interestIndex);
    }