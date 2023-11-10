/* retrieve JSON data from external JSON file */
let qArray;
$.getJSON("questions.json", function (data) {
  qArray = data;
})
  .done(function () {
    console.log(qArray);
  })
  .fail(function (jqxhr, textStatus, errorThrown) {
    console.error("Error loading JSON file: " + errorThrown);
  });

/* initialize values for question number and score */
let qNumber = 0;
let score = 0;

/* event listener for start quiz button - hides start page and calls generateQuizQuestion function */
function startQuiz() {
  $("main").on("click", "#button-start", function (event) {
    $(".start-quiz").hide();
    generateQuizQuestion();
  });
}

/* display quiz questions from the questions array until the very last question has been displayed, then call the displayResults function */
function generateQuizQuestion() {
  if (qNumber < qArray.length) {
    let question = $(`<form class="js-quiz-form">
    <legend class="question">${qArray[qNumber].question}</legend>
    <ul class="radiogroup" role="radiogroup" aria-labelledby="question"></ul>`);
    let answers = qArray[qNumber].answer.map(function (
      answerValue,
      answerIndex
    ) {
      return `<label for="${answerValue}"><input type="radio" id="${answerValue}" name="answer" tabindex="${answerIndex}" value="${answerValue}" aria-checked="false" required><span>${answerValue}</span></label><br>`;
    });
    let button = $(
      `<button type="submit" id="button-submit">Submit</button></form>`
    );
    $(".js-quiz").append(question);
    $(".radiogroup").append(answers, button);
    $('input[type="radio"]').on("click", function () {
      // if not selected, background color remains white
      $('input[type="radio"]').not(this).closest("label").css("background-color", "#edf8f5");
      // change background color for the selected answer
      $(this).closest("label").css("background-color", "#edbe4a");
   });
  } else {
    displayResults();
  }
}

/* event listener for submit button - check to see if an input is selected and if the selected answer is correct or not */
function questionChecker() {
  $("main").on("click", "#button-submit", function (event) {
    if ($("input:radio").is(":checked")) {
      event.preventDefault();
      let selectedAnswer = $("input[name=answer]:checked").val();
      if (selectedAnswer === qArray[qNumber].correctAnswer) {
        rightAnswer();
      } else {
        wrongAnswer();
      }
    } else {
      alert("Please select an answer.");
    }
  });
}

/* correct answer feedback - update score */
function rightAnswer() {
  $('input[type="radio"]:checked').closest("label").css("background-color", "#90ee90");
  $("#button-submit").hide();
  // disable radio buttons after answer is submitted
  $('input[type="radio"]').on("click", function () {
    return false;
  });
  // disable onclick function for background color changes
  $('input[type="radio"]').off("click");
  $(".js-answer")
    .append(
      `<h2 style="color: #90ee90;">You're Right!</h2>
        <p><span class="comment">${qArray[qNumber].comment}</span></p>
        <button type="button" id="button-next">Next</button>`
    )
    .show();
  score++;
}

/* incorrect answer feedback - provide correct answer */
function wrongAnswer() {
  $('input[type="radio"]:checked').closest("label").css("background-color", "#ffb6ad");
  $("#button-submit").hide();
  $('input[type="radio"]').on("click", function () {
    return false;
  });
  $('input[type="radio"]').off("click");
  $(".js-answer")
    .append(
      `<h2 style="color: #ffb6ad;">Incorrect!</h2>
        <h3>The correct answer is:</h3>
        <p style="margin-bottom: 0;"><span class="correct-answer">${qArray[qNumber].correctAnswer}</span></p>
        <p><span class="comment">${qArray[qNumber].comment}</span></p>
        <button type="button" id="button-next">Next</button>`
    )
    .show();
}

/* event listener for next question button - call the generateQuizQuestion function to display the next question */
function nextQuestion() {
  $("main").on("click", "#button-next", function (event) {
    $(".js-answer").empty();
    $(".js-quiz-form").empty();
    qNumber++;
    generateQuizQuestion();
    $("js-quiz-form").show();
  });
}

/* display the final percentage score and total number of correct answers */
function displayResults() {
  let finalScore = (score / qNumber) * 100;
  $(".js-answer").append(`<h2>Quiz Results</h2>
    <img id="results-page" alt="k-drama art wallpaper" src="https://cutewallpaper.org/22x/nfj5gfb13/33675152.jpg"/>
    <h3>Score: ${finalScore}%</h3>
    <p>You got <span class="right-answers">${score}</span> out of <span class="right-answers">${qNumber}</span> questions right.</p>
    <button type="button" id="button-restart">Restart Quiz</button>`);
}

function restartQuiz() {
  $("main").on("click", "#button-restart", function (event) {
    score = 0;
    qNumber = 0;
    $(".js-answer").empty();
    $(".js-quiz-form").empty();
    $(".start-quiz").show();
  });
}

function handleQuizApp() {
  startQuiz();
  questionChecker();
  nextQuestion();
  restartQuiz();
}

/* call handleQuizApp to activate functions with event listeners */
$(handleQuizApp);
