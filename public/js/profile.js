//create firebase references
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


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("demo").innerHTML = "Welcome, " + user.displayName;
        displayData(user)
        saveData(user)
    } else {
    }
});


const auth = firebase.auth();

const db = firebase.firestore()


// UI Element Locations

const container = document.querySelector('.container')
const loading = document.querySelector('.loading');

const bookList = document.querySelector('#book-list');
const form = document.querySelector('#add-book-form');


db.settings({ timestampsInSnapshots: true})

// create HTML element and render data in books collection
function displaySummary(doc){

    let li = document.createElement('div');
    let deleteArea = document.createElement('div');
    let minusSign = document.createElement('p');
    let imgArea = document.createElement('div');
    let cover = document.createElement('img');
    let summary = document.createElement('div');
    let title = document.createElement('h4');
    let author = document.createElement('p');
    let rating = document.createElement('h5');
    let summaryBy = document.createElement('p');
    let ruler = document.createElement('hr');
    let description = document.createElement('p');
    let deleteBtn = document.createElement('button');


    li.className = "main-container";
    summary.className = "summary";
    rating.className = "rating";
    author.className = "author";
    summaryBy.className ="summaryBy";
    title.className = "book-title";

    li.setAttribute('dataId', doc.id);
    deleteBtn.setAttribute('postId', doc.id);

    imgArea.className = "imgArea";
    cover.className = "image";
    description.className = "desc";
    deleteArea.className = "deleteArea";
    deleteBtn.className = "deleteBtn";

    minusSign.className = 'minusSign';

    cover.src = doc.data().imageURL;

    title.textContent = doc.data().title;
    author.textContent = "Author - " + doc.data().author;
    rating.textContent = "Rating - " + doc.data().rating + '/5';
    summaryBy.textContent = "Summary By " + doc.data().summaryBy;
    description.textContent = doc.data().summary;

    minusSign.textContent = '-';

    deleteBtn.setAttribute('id', 'deleteBtn')

    li.appendChild(deleteArea)
    deleteArea.appendChild(deleteBtn);
    deleteBtn.appendChild(minusSign);
    li.appendChild(imgArea);
    imgArea.appendChild(cover)
    li.appendChild(summary);
    summary.appendChild(title);
    summary.appendChild(author);
    summary.appendChild(rating);
    summary.appendChild(summaryBy);
    summary.appendChild(ruler);
    summary.appendChild(description);

    bookList.append(li);

    deleteBtn.addEventListener('click', (e) => {
        let id = e.target.parentElement.getAttribute('postId');
        db.collection('books').doc(id).delete();
    })
}

//Get Data from DB in Realtime

function displayData(user){
    db.collection('books')
        .orderBy('timestamp')
        .where("postId", "==", user.uid)
        .onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    displaySummary(change.doc);
                } else if (change.type === 'removed') {
                    let li = bookList.querySelector(`[dataId="${change.doc.id}" ]`);
                    bookList.removeChild(li);
                }
            })
        })

}


var storageRef = firebase.storage().ref();

var fileButton = document.getElementById('submitImage');

fileButton.addEventListener('change', function(e) {
    document.getElementById('coverURL').value = '';
    var file = e.target.files[0];
    var uploadTask = storageRef.child('images/' + file.name).put(file);
    uploadTask.on('state_changed',
        () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            document.getElementById('coverURL').value = downloadURL;
            });
        }
    );
});

reviewDate = new Date();

const addSummaryBtn = document.querySelector('#submit-summary-btn');


//saving data

function saveData(user){

    addSummaryBtn.addEventListener('click',(e) =>{



        let imageURL;
        e.preventDefault();

        if(form.title.value, form.author.value, form.rating.value, form.summary.value){

            if(form.coverURL.value === ""){

                imageURL = 'https://firebasestorage.googleapis.com/v0/b/book-project-37efa.appspot.com/o/no-book-cover.png?alt=media&token=38f2cbec-1f4c-448f-911e-0254bbcde9a9';
            }
            else{

                imageURL = form.coverURL.value;
            }

            writeData(user, imageURL);

            form.title.value = '';
            form.name.value = '';
            form.author.value = '';
            form.rating.value = '';
            form.summary.value = '';
            form.coverURL.value = '';
        }
        else {
            alert("Enter all details before submission!")
        }

        $('#SummaryModal').modal('hide');

    })
}

function writeData(user, imageURL){

    db.collection('books').add({
        title: form.title.value,
        author: form.author.value,
        rating: form.rating.value,
        imageURL: imageURL,
        summary: form.summary.value,
        summaryBy: user.displayName,
        postId: user.uid,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

}


//Buttons
const homeBtn = document.querySelector('#home-btn');
homeBtn.addEventListener('click', e => {
    e.preventDefault();
    window.location = 'homepage.html'
})

const profileBtn = document.querySelector('#profile-btn');
profileBtn.addEventListener('click', e => {
    e.preventDefault();
    window.location = 'profile.html'
})

const logoutBtn = document.querySelector('#logout-btn');
logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut();
    console.log('User signed out!')
    window.location = 'index.html'
})