//importing quotes and images
import vikingImgs from "./pics.mjs";
import vikingQuotes from "./quotes.mjs";

//settting up all the HTML elements
const quoteEl = document.getElementById("quote");
const quoteSourceEl = document.getElementById("quote-source");
const timeEl = document.getElementById("time");
const nameInputEl = document.getElementById("name-input");
const nameFormEl = document.getElementById("name-form");
const greetingEl = document.getElementById("greeting-h1");
const afterContentEl = document.getElementsByClassName("content-after")[0];
const nameArticleEl = document.getElementsByClassName("name-article")[0];

//declaring variables
let nameVal;

//making a function that returns random item from given array
function randomIndexes(array) {
  return Math.floor(Math.random() * array.length);
}

//setting up the background image
let randomImageIndex = randomIndexes(vikingImgs);
let randomImage = vikingImgs[randomImageIndex];
document.body.style.backgroundImage = `url('${randomImage}')`;

//getting name from localStorage if available
let getPastName = localStorage.getItem("nameVal");

if (getPastName == undefined || getPastName == null) {
  //setting time & greeting article to display none at the beginning
  afterContentEl.style.display = "none";

  //adding Eventlistener for name
  nameFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    afterContentEl.style.display = "block";
    nameArticleEl.style.display = "none";

    showContentFirstTime();
  });
} else {
  nameArticleEl.style.display = "none";
  showContentAfter();
}

//setting up every innerHTMLs
function showContent() {
  setInterval(() => {
    const date = new Date();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();

    hours = hours == 0 ? 12 : hours > 12 ? hours - 12 : hours;
    hours = hours.length == 1 ? 0 + hours.toString() : hours;
    minutes = minutes.length == 1 ? 0 + minutes : minutes;

    timeEl.innerHTML = hours + ":" + minutes;
  }, 1);

  //getting a random quote
  let randomQuoteIndex = randomIndexes(vikingQuotes);
  let randomQuote = vikingQuotes[randomQuoteIndex];

  //adding all the innerHTMLs
  greetingEl.innerHTML = "Hei, " + nameVal;
  quoteEl.innerHTML = '"' + randomQuote.quote + '"';
  quoteSourceEl.innerHTML = randomQuote.source;
  localStorage.setItem("nameVal", nameVal);
}

//showing the main content after user inputs name for the first time
function showContentFirstTime() {
  nameVal = nameInputEl.value;

  showContent();
}

//getting name from local storage
function showContentAfter() {
  nameVal = getPastName;

  showContent();
}