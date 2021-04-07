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

const db = firebase.firestore()

const auth = firebase.auth();

const container = document.querySelector('.container');

// store last document retrieved
let latestDoc = null;

const getNextReviews = async (doc) => {

    const ref = db.collection('books')
        .orderBy('timestamp', 'asc')
        .startAfter(doc || 0)
        .limit(5);

    const data = await ref.get();

    // output docs

    let template = '';

    data.docs.forEach(doc => {
        const bookReview = doc.data();
        template += `
<div class="book-list">
      <div class="main-container", data-id="${doc.id}">
      <div class="imgArea"><img class="image" src="${bookReview.imageURL}"></div>
      <div class="summary">
        <h4 class="book-title">${bookReview.title}</h4>
        <p class="author">Author - ${bookReview.author}</p>
        <h5 class="rating">Rating - ${bookReview.rating}/5</h5>
        <p class="summaryBy">Summary By ${bookReview.summaryBy}</p>
        <hr>
        <p class="desc">${bookReview.summary}</p>
        </div>
      </div>
      </div>
    `
    })
    container.innerHTML += template;
    container.classList.remove('active');

    // update latest doc
    latestDoc = data.docs[data.docs.length - 1];

    // unattach event listeners if no more docs
    if (data.empty) {
        loadMore.removeEventListener('click', handleClick);
    }
}

// load data on DOM loaded
window.addEventListener('DOMContentLoaded', () => getNextReviews());

// load more docs (button)
const loadMore = document.querySelector('.load-more');

const handleClick = () => {
    getNextReviews(latestDoc)
}

loadMore.addEventListener('click', handleClick);


//Signed-In User Activity
auth.onAuthStateChanged((user) => {
    if (user) {
    } else {
    }
});



//Button Listeners and Authentication Functions

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