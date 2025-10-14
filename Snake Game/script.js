const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const scoreDisplay=document.getElementById('score');
const gameOverDiv=document.getElementById('gameOver');
const restartBtn=document.getElementById('restartBtn');
const playAgainBtn=document.getElementById('playAgainBtn');
const box=20;
const canvasSize=400;

let snake;
let direction;
let food;
let score;
let game=null;

function initGame(){
    snake=[{x:9*box,y:10*box}];
    direction="";
    food=generateFood();
    score=0;
    scoreDisplay.textContent=score;
    gameOverDiv.classList.add('hidden');
    if(game) clearInterval(game);
    game=setInterval(draw,100);
}

function generateFood(){
    return{
        x:Math.floor(Math.random()*(canvasSize/box))*box,
        y:Math.floor(Math.random()*(canvasSize/box))*box,
    };
}

function draw(){
    ctx.clearRect(0,0,canvasSize,canvasSize);
    //DRAW SNAKE
    for(let i=0;i<snake.length;i++){
        ctx.fillStyle=i==0?'#0f0':'#0a0';
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
    }
    //DRAW FOOD
    ctx.fillStyle='#f00';
    ctx.fillRect(food.x,food.y,box,box);

    if(direction==="") return;
    let headX=snake[0].x;
    let headY=snake[0].y;

    if(direction==='LEFT')headX-=box;
    if(direction==='RIGHT')headX+=box;
    if(direction==='UP')headY-=box;
    if(direction==='DOWN')headY+=box;
    
    if(
        headX<0 || headY<0 || headX>=canvasSize || headY>=canvasSize || collision(headX,headY,snake)
    ){
        clearInterval(game);
        game=null;
        gameOverDiv.classList.remove('hidden');
        return;
    }
    let newHead={x:headX,y:headY};

    if(headX==food.x && headY==food.y){
        score++;
        scoreDisplay.textContent=score;
        food=generateFood();
    }else{
        snake.pop();
    }
    snake.unshift(newHead);
}

function changeDirection(event){
    const key=event.keyCode;
    if(!game) return;
    if(key===37 && direction!=='RIGHT')direction='LEFT';
    if(key===38 && direction!=='DOWN')direction='UP';
    if(key===39 && direction!=='LEFT')direction='RIGHT';
    if(key===40 && direction!=='UP')direction='DOWN';
} 
function collision(x,y,array){
    return array.some(part=>part.x===x && part.y===y);
}
function restartGame(){
    initGame();
}
document.addEventListener('keydown',changeDirection);
restartBtn.addEventListener('click',restartGame);
playAgainBtn.addEventListener('click',restartGame);

initGame();


