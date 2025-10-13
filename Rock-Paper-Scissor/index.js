const buttons = document.querySelectorAll('button');

const resultE1 = document.getElementById("result");

const playerScoreE1= document.getElementById("user-score");
const computerScoreE1= document.getElementById("computer-score");

let playerScore = 0;
let computerScore = 0;

buttons.forEach(button => {
    button.addEventListener('click',() => {
        const result=playRound(button.id, computerPlay());
        resultE1.textContent = result;
    });
});

function computerPlay() {
    const choices = ["rock","paper","scissors"];
    const randomChoice=Math.floor(Math.random()*choices.length);
    return choices[randomChoice];
}

function playRound(playerSelection,computerSelction) {
    if(playerSelection === computerSelction) {
        return "It's a tie! ";
    } else if (
        (playerSelection==="rock" && computerSelction === "scissors") || (playerSelection==="paper" && computerSelction === "rock") || (playerSelection==="scissors" && computerSelction === "paper")
    ) {
        playerScore++;
        playerScoreE1.textContent= playerScore;
        return "You win! " + playerSelection + " beats " + computerSelction;
    } else {
        computerScore++;
        computerScoreE1.textContent=computerScore;
        return "You lose! " + computerSelction + " beats " + playerSelection;
    }
}