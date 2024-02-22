// add variables that keep track of the quiz "state"
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// add variables to reference DOM elements
// example is below
let questionsEl = document.getElementById('questions');
let startScreenEl = document.getElementById('start-screen');
let timerEl = document.getElementById('timer');
let choicesEl = document.getElementById('choices');
let feedbackEl = document.getElementById('feedback');
let initialsEl = document.getElementById('initials');
let startBtn = document.getElementById('start-btn');
let submitBtn = document.getElementById('submit-btn');

// reference the sound effects
let sfxRight = new Audio('assets/sfx/correct.wav');
let sfxWrong = new Audio('assets/sfx/incorrect.wav');

function startQuiz() {
  // hide start screen
  startScreenEl.style.display = 'none';

  // un-hide questions section
  questionsEl.style.display = 'block';

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timerEl.textContent = time;

  // call a function to show the next question
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  let currentQuestion = questions[currentQuestionIndex];

  // update title with current question
  let questionTitleEl = document.getElementById('question-title');
  if (questionTitleEl) {
    questionTitleEl.textContent = currentQuestion.title;
  }

  // clear out any old question choices
  let choicesEl = document.getElementById('choices');
  if (choicesEl) {
    choicesEl.innerHTML = '';
  
    // loop over the choices for each question
    currentQuestion.choices.forEach(function(choice) {
      // create a new button for each choice
      let choiceButton = document.createElement('button');
      choiceButton.setAttribute('class', 'choice');
      choiceButton.setAttribute('value', choice);
      choiceButton.textContent = choice;
  
      // add click event listener to each choice button
      choiceButton.onclick = questionClick;
  
      // display the choice button on the page
      choicesEl.appendChild(choiceButton);
    });
  }
}

function questionClick(event) {
  // identify the targeted button that was clicked on
  let target = event.target;
  // if the clicked element is not a choice button, do nothing.
  if (!target.matches('button')) return;

  // Check if user guessed wrong
  if (target.value !== questions[currentQuestionIndex].answer) {
    // If they got the answer wrong, penalize time by subtracting 15 seconds from the timer
    time -= 1;
    console.log(questions[currentQuestionIndex].answer)
    // If they run out of time (i.e., time is less than zero) set time to zero so we can end quiz
    if (time < 0) {
      time = 0;
    }

  // display new time on page
  timerEl.textContent = time;
  // play "wrong" sound effect
  sfxWrong.play();
  // display "wrong" feedback on page
  feedbackEl.textContent = 'Wrong!';
} else {
  // play "right" sound effect
  sfxRight.play();
  // display "right" feedback on page by displaying the text "Correct!" in the feedback element
  feedbackEl.textContent = 'Correct!';
}
  // Flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute('class', 'feedback');
  setTimeout(function () {
    // After one second, remove the "feedback" class from the feedback element
    feedbackEl.removeAttribute('class');
  }, 500);
// move to next question
currentQuestionIndex++;

// check if we've run out of questions
if (time <= 0 || currentQuestionIndex === questions.length) {
  // If the time is less than zero and we have reached the end of the questions array,
  // call a function that ends the quiz (quizEnd function)
  quizEnd();
} else {
  // Otherwise, get the next question
  getQuestion();
}
}

// define the steps of the QuizEnd function...when the quiz ends...
function quizEnd() {
  // stop the timer
  clearInterval(timerId);
  // show end screen
  document.getElementById('end-screen').style.display = 'block';
  // show final score
  document.getElementById('final-score').textContent = time;
  // hide the "questions" section
  questionsEl.style.display = 'none';
}

// add the code in this function to update the time, it should be called every second
function clockTick() {
  // right here - update time
  time--;
  // update the element to display the new time value
  timerEl.textContent = time;
  // check if user ran out of time; if so, call the quizEnd() function
  if (time <= 0) {
    quizEnd();
  }
}

// Complete the steps to save the high score
function saveHighScore() {
  // Get the value of the initials input box
  let initials = initialsEl.value.trim();

  // Make sure the value of the initials input box wasn't empty
  if (initials !== '') {
    // Check and see if there is a value of high scores in local storage
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // If there isn't any, then create a new array to store the high score
    // Add the new initials and high score to the array
    highScores.push({ initials: initials, score: time });

    // Sort the high scores in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Keep only the top 5 high scores
    highScores = highScores.slice(0, 5);

    // Convert the array to a piece of text
    let highScoresText = JSON.stringify(highScores);

    // Store the high score in local storage
    localStorage.setItem('highScores', highScoresText);

    // Redirect the user to the high scores page
    window.location.href = 'highscores.html';
  }
}

// Use this function when the user presses the "enter" key when submitting high score initials
function checkForEnter(event) {
  // If the user presses the enter key, then call the saveHighscore function
  if (event.key === 'Enter') {
    saveHighScore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighScore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on an element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;
