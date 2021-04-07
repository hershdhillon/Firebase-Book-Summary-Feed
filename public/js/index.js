
//initializing the firebase app

const firebaseConfig = {
    apiKey: "AIzaSyBQJTSe8sF0EkBfv68xJu1s_M10gfMiMEI",
    authDomain: "book-project-37efa.firebaseapp.com",
    projectId: "book-project-37efa",
    storageBucket: "book-project-37efa.appspot.com",
    messagingSenderId: "91377771776",
    appId: "1:91377771776:web:b371cdf40211604bd83fe5",
    measurementId: "G-0RXLT7E5FH"
};

firebase.initializeApp(firebaseConfig);

//create firebase references
const auth = firebase.auth();
const dbRef = firebase.database();
const usersRef = dbRef.ref('user')


//Login
const loginBtn = document.querySelector('#login-button');

loginBtn.addEventListener('click', e => {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(cred => {
            console.log('User Logged In!');
        })
        .catch(error => {
            console.log(error.message);
            modal.style.display = "block";
        })
})


//Modal for Incorrect Login

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];


//Sign-up
const signupBtn = document.querySelector('#register-button');
signupBtn.addEventListener('click', e => {
    e.preventDefault();


    const loginData = {
        email: document.querySelector('#register-email').value,
        password: document.querySelector('#register-password').value,
    }

    auth.createUserWithEmailAndPassword(loginData.email, loginData.password).then(cred => {
        const user = firebase.auth().currentUser;
        return user.updateProfile({
            displayName: document.querySelector('#register-name').value
        }).catch((error) => {
            console.log("Error creating user:", error);
        });
    });
    $('#RegisterModal').modal('hide');
});



window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//Modal for Incorrect Login
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        window.location = 'homepage.html'
        // ...
    } else {
        // User is signed out
        // ...
    }
});




