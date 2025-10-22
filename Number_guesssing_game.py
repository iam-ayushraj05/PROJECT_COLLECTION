<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Number Guessing Game</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: linear-gradient(to right, #11998e, #38ef7d);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        color: #fff;
        flex-direction: column;
    }
    .container {
        background: rgba(0,0,0,0.4);
        padding: 30px;
        border-radius: 10px;
        text-align: center;
    }
    input {
        padding: 10px;
        width: 100px;
        border-radius: 5px;
        border: none;
        margin-right: 10px;
    }
    button {
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background: #ffdd59;
        color: #000;
        font-weight: bold;
    }
    #feedback {
        margin-top: 20px;
        font-size: 1.2em;
    }
</style>
</head>
<body>
<div class="container">
    <h1>Number Guessing Game 🎯</h1>
    <p>Guess a number between 1 and 100</p>
    <input type="number" id="guessInput" placeholder="Your guess" min="1" max="100">
    <button onclick="checkGuess()">Guess</button>
    <button onclick="restartGame()">Play Again</button>
    <div id="feedback"></div>
</div>

<script>
let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess() {
    const userGuess = Number(document.getElementById('guessInput').value);
    const feedback = document.getElementById('feedback');
    attempts++;

    if(userGuess === randomNumber){
        feedback.textContent = `🎉 Correct! You guessed it in ${attempts} attempts.`;
    } else if(userGuess > randomNumber){
        feedback.textContent = "⬇️ Too high! Try again.";
    } else if(userGuess < randomNumber){
        feedback.textContent = "⬆️ Too low! Try again.";
    } else {
        feedback.textContent = "⚠️ Enter a valid number!";
    }
}

function restartGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('feedback').textContent = '';
    document.getElementById('guessInput').value = '';
}
</script>
</body>
</html>
