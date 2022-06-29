
//======================================================================
//                          Global Variables
//======================================================================

// Letters
const letters = "abcdefghijklmnopqrstuvwxyz";

// Get Array From Letters
let lettersArray = Array.from(letters);

// Select Letters Container
const lettersContainer = document.querySelector(".letters");

// Generate Letters
lettersArray.forEach(letter => {

  // Create Span
  let span = document.createElement("span");

  // Create Letter Text Node
  let theLetter = document.createTextNode(letter);

  // Append The Letter To Span
  span.appendChild(theLetter);

  // Add Class On Span
  span.className = 'letter-box';

  // Append Span To The Letters Container
  lettersContainer.appendChild(span);

});



// Create an object of categories with words
const words = {
    movies: ["into the wild", "the godfather", "the matrix", "home alone"],
    people: ["albert einstein", "hitchcock", "michael jackson", "cleopatra", "mahatma ghandi"],
    countries: ["bulgaria", "germany", "yemen", "egypt", "malta", "qatar"]
  };

//Define the chosen word
let chosenWord = "" ;

// Get all categories
let allCategories = Object.keys(words);

// Array for the right letters
const rightWord = [];

// Array for the wrong letters
const wrongWord = [];

// Empty underscores for every letter of the chosen word
const underScore = [];

//Lives at the start
let lives = 8;

//======================================================================
//                         Dom Manipulations
//======================================================================
const arrowContainer = document.querySelector('.arrow-container');
const heading2 = document.querySelector('.h2');
const categoryContainer = document.querySelector('div.category');
const docSelectCategory = document.querySelector("#select_category");
const docCategoryOption = document.querySelectorAll("option");
const firstOption = document.getElementById('first_option');
const docUnderScore = document.getElementsByClassName('underscore');
const docRightGuess = document.getElementsByClassName('rightGuess');
const docWrongGuess = document.querySelector('.wrong-guess');
const docGuesses = document.getElementById('guesses');
const theDraw = document.querySelector(".hangman-draw");
const button = document.querySelector('.btn_refresh');
const livesContainer = document.querySelector('div.lives');
const playField = document.querySelector('.main')


//======================================================================
//                                MAIN
//======================================================================

// The player should click the arrow and select a category in order to start the game
arrowContainer.onclick = () => {
    categoryContainer.classList.add('be-visible');
    heading2.classList.add('be-visible');
}

//Create underscores or empty spaces based on length of word
const generateUnderscore = () => {
    for (let i = 0; i < chosenWord.length; i++) {
        if(chosenWord[i] == ' ') {
            underScore.push("&nbsp");
        } else {
            underScore.push('_');
        }
    }
   docUnderScore[0].innerHTML = underScore.join(' ');
    return underScore;
}; 


//Remove underscores
const removeUnderScore = () => {
    underScore.splice(0);
}

// Disable the keyboard
document.onkeydown = () => false;


// Print underscores for a random word of the selected category
let print = () => {

    //remove underscores before generating new ones
    removeUnderScore();

    // get a category and the words in every category
    for (let i = 0; i < allCategories.length; i++) {
        //get a category
        let category = allCategories[i]; 
        docCategoryOption.innerHTML = category;
        // get the words in every category
        let wordsInCategory = words[category];  

        // check if a category has been selected, hide the start page and desplay the game field
        if (docSelectCategory.value == category || docSelectCategory.value == 'random') {
            arrowContainer.classList.add('no-display');
            // theDraw.classList.add('display');  
            // livesContainer.classList.add('display');
            // docWrongGuess.classList.add('display');
            // button.classList.add('display');
            // lettersContainer.classList.add('display'); 
            playField.classList.add('display'); 
        }

        // check which category has been selected and generate underscores for a random word of it 
        if (docSelectCategory.value == category) {
            chosenWord = wordsInCategory[Math.floor(Math.random() *wordsInCategory.length)];  
            generateUnderscore();
            //unlock the keyboard
            document.onkeydown = () => true;
            //disable the "select a category" option
            firstOption.disabled = true; 
        }
    }

    // if the selected category is "random", generate underscores for a random word of a random category
    if (docSelectCategory.value == 'random') {
        // get a random category
        let categoryRandom = allCategories[Math.floor(Math.random() * allCategories.length)];
        // words in random category 
        let wordsInRandomCategory = words[categoryRandom];
        // randomly chosen word in random category
        let chosenWordInRandomCategory = wordsInRandomCategory[Math.floor(Math.random() * wordsInRandomCategory.length)];
        chosenWord = chosenWordInRandomCategory;  
        generateUnderscore(); 
    }  
}


// Let the player select a category
docSelectCategory.addEventListener('change',print);


//Get users guess on Computer/ Keyboard
document.addEventListener('keypress', (event) => {

    //once the game has been started the player is not allowed to change the category/ word
    docSelectCategory.disabled = true;

    // guess a letter by typing on the keyboard
    let keyword =(event.key).toLowerCase();

    // alert player to guess a letter only once
    if (JSON.stringify(wrongWord).includes(keyword) || JSON.stringify(rightWord).includes(keyword)){
        // sound alert
        document.getElementById("alert").play();
        // pop-up message alert
        swal("You've already used this letter!","Choose another letter", "warning");

    // game over by 8 wrong letters 
    } else  if ( wrongWord.length === 8){
        document.getElementById("game_over").play();
        swal('Game over!', 'Start a new game', 'error');
        // disable keyboard input
        document.onkeydown = () => false
    

    //if the guess is wrong
    } else if (!(chosenWord.includes(keyword))) {
        // player is loosing live points
        lives--;
        docGuesses.innerHTML = lives;
        // put wrong words into wrongWord and show the wrong letters to the player
        wrongWord.push(keyword);
        docWrongGuess.innerHTML = wrongWord.join(', ');
        // add class wrong on the draw element and draw the hangman
        theDraw.classList.add(`wrong-${wrongWord.length}`);
        // play a sound alerting the wrong answer
        document.getElementById("wrong_answer").play();
         
    //if the guess is right
    }  else {
        // put right letter into rightWord 
        rightWord.push(keyword);
        //replace underscore with the right letter
        let letter = chosenWord.split('');
        letter.forEach((letter, index) => {
            if (letter == keyword) {
                underScore[index] = letter;
                docUnderScore[0].innerHTML = underScore.join(' '); 
            }
        });

        // check if the guessed word matches the chosen word
        if (underScore.join('').replace(/&nbsp/g, ' ') == chosenWord) {
            // play success sound
            document.getElementById("success").play();
            // congratulate the player
            swal("Good job!", "The word was " + chosenWord.toUpperCase(), "success");
            // disable keyboard input
            document.onkeydown = () => false;
        }  
    }
});

//Get users guess Mobile / Virtual Keyboard
document.addEventListener('click', (event) => {
  // Set The Choose Status
  let theStatus = false;

  if (event.target.className === 'letter-box') {
  
      event.target.classList.add("clicked");
  
    // Get Clicked Letter
      let theClickedLetter = event.target.innerHTML.toLowerCase();

    //once the game has been started the player is not allowed to change the category/ word
      docSelectCategory.disabled = true;

      if ( wrongWord.length === 8){
          document.getElementById("game_over").play();
          alert('Game over!');
          // disable keyboard input
          document.onkeydown = () => false
      

      //if the guess is wrong
      } else if (!(chosenWord.includes(theClickedLetter))) {
          // player is loosing live points
          lives--;
          docGuesses.innerHTML = lives;
          // put wrong words into wrongWord and show the wrong letters to the player
          wrongWord.push(theClickedLetter);
          docWrongGuess.innerHTML = wrongWord.join(', ');
          // add class wrong on the draw element and draw the hangman
          theDraw.classList.add(`wrong-${wrongWord.length}`);
          // play a sound alerting the wrong answer
          document.getElementById("wrong_answer").play();
          
      //if the guess is right
      }  else {
          // put right letter into rightWord 
          rightWord.push(theClickedLetter);
          //replace underscore with the right letter
          let letter = chosenWord.split('');
          letter.forEach((letter, index) => {
              if (letter == theClickedLetter) {
                  underScore[index] = letter;
                  docUnderScore[0].innerHTML = underScore.join(' '); 
              }
          });

          // check if the guessed word matches the chosen word
          if (underScore.join('').replace(/&nbsp/g, ' ') == chosenWord) {
              // play success sound
              document.getElementById("success").play();
              // congratulate the player
              alert("Good job! The word was " + chosenWord.toUpperCase());
              // disable keyboard input
              document.onkeydown = () => false;
          }  
      }
  }
});





//======================================================================
