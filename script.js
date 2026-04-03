const board = document.querySelector('.board');
const startbutton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startgameModal =document.querySelector('.start-game');
const gameoverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');
const HighScoreElement = document.getElementById('High-Score');
const ScoreElement = document.getElementById('Score');
const TimeElement = document.getElementById('Time');
const eatSound = new Audio("./sounds/eat.mp3");
const gameOverSound = new Audio("./sounds/gameover.mp3");
const startSound = new Audio("./sounds/start.mp3");
const backgroundMusic = new Audio("./sounds/background.mp3");
const blockHeight = 50;
const blockWidth = 50;

let HighScore = parseInt(localStorage.getItem("HighScore")) || 0;
let Score = 0;
let Time =`00:00:00`;

const cols = Math.floor(board.clientWidth/blockWidth);
const rows = Math.floor(board.clientHeight/blockHeight);
let intervalID = null;
let timeIntervalID = null;
let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

const blocks = []
let snake = [
    {x:1, y:3}
]

let direction = "right";

for(let row = 0; row<rows; row++){
    for(let col=0; col<cols; col++){
    const block =document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
   blocks[`${row}-${col}`] = block;
    }
}

function render(){
let head = null

blocks[ `${food.x}-${food.y}`].classList.add("food");

if(direction ==="left"){
    head = {x: snake[0].x , y: snake[0].y -1}
}else if(direction ==="right"){
    head = {x: snake[0].x , y: snake[0].y +1}
}else if(direction ==="up"){
    head = {x: snake[0].x -1 , y: snake[0].y }
}else if(direction ==="down"){
    head = {x: snake[0].x +1 , y: snake[0].y }
}

function endgame(){
     backgroundMusic.pause();
        gameOverSound.play();
    gameOverSound.volume = 0.6;
clearInterval(intervalID);
modal.style.display = "flex";
startgameModal.style.display = "none";
gameoverModal.style.display = "flex";
return;
};

if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
  endgame();
}

if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){    
endgame();
}

if(head.x === food.x && head.y === food.y){
    eatSound.play();
    eatSound.volume = 0.8;
    blocks[ `${food.x}-${food.y}`].classList.remove("food");
    food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
    blocks[ `${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head);

    Score += 10;
    ScoreElement.innerText= Score;

    if(Score > HighScore){
        HighScore = Score;
        localStorage.setItem("HighScore", HighScore.toString());
        HighScoreElement.innerText = HighScore;
    }

}

snake.forEach(segment => {
    blocks[ `${segment.x}-${segment.y}`].classList.remove("fill");
})

snake.unshift(head);
snake.pop();
snake.forEach(segment => {
    blocks[ `${segment.x}-${segment.y}`]?.classList.add("fill");
})

}


startbutton.addEventListener("click",()=>{
    startSound.play();
    startSound.volume = 0.6;
    modal.style.display = "none";
    backgroundMusic.loop = true;
backgroundMusic.volume = 0.01;
backgroundMusic.play();
    intervalID = setInterval(()=>{
        render();
    }, 300);

    timeIntervalID = setInterval(()=>{
        let [hours, minutes, seconds] = Time.split(":").map(Number);
        seconds++;
        Time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        TimeElement.innerText = Time;
    }, 1000);
}); 

restartButton.addEventListener("click", restartGame);

function restartGame(){
blocks[ `${food.x}-${food.y}`].classList.remove("food");
snake.forEach(segment => {
    blocks[ `${segment.x}-${segment.y}`]?.classList.remove("fill");
})
direction = "right";
Score = 0;
Time = `00:00:00`;

backgroundMusic.loop = true;
backgroundMusic.volume = 0.01;
backgroundMusic.play();

modal.style.display = "none";
snake = [{x:1, y:3}]   
food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
 intervalID = setInterval(()=>{
        render();
    }, 300);
};



addEventListener("keydown", (e)=>{
    if(e.key === "ArrowLeft" || e.key === "a"){
        direction = "left";
    }   else if(e.key === "ArrowRight" || e.key === "d"){    
        direction = "right";
    }   else if(e.key === "ArrowUp" || e.key === "w"){
        direction = "up";
    }   else if(e.key === "ArrowDown" || e.key === "s"){
        direction = "down";
    }   
})


