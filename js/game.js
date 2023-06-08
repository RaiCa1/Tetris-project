
const canvas = document.getElementById("canvas");
const start_bt = document.getElementById("start-button");
const pause_bt = document.getElementById("pause-button");
const ctx = canvas.getContext("2d");

const text = document.getElementById("text");

const ROW = 18;
const COL = 10;
const SQ = 40;
const COLOR = "WHITE";

let score = 0;

// Tạo dải màu
var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop("0", "magenta");
gradient.addColorStop("0.5", "blue");
gradient.addColorStop("1.0", "red");

ctx.fillStyle = gradient;
ctx.font = "30px Georgia";
ctx.fillText("Press start button", 90, 360);

function drawSquare(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

let bg_board = []
for (let r = 0; r < ROW; r++){
    bg_board[r] = [];
    for (let c = 0; c < COL; c++){
        bg_board[r][c] = COLOR;
    }
}
let board = [];
for (let r = 0; r < ROW; r++){
    board[r] = [];
    for (let c = 0; c < COL; c++){
        board[r][c] = COLOR;
    }
}


function drawBoard(){
    for (let r = 0; r < ROW; r++){
        for ( let c = 0; c < COL; c++){
            drawSquare(c, r, board[r][c]);
        }
    }
}


class Piece{
    constructor(tetromino, color){
        this.tetromino = tetromino;
        this.color = color;

        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino[this.tetrominoN];

        this.x = Math.floor(Math.random() * 6) + 1;
        this.y = -2;
    }

    fill(color){
        for (let r = 0; r < this.activeTetromino.length; r++){
            for (let c = 0; c < this.activeTetromino.length; c++){
                if (this.activeTetromino[r][c]){
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    Draw(){
        this.fill(this.color);
    }

    unDraw(){
        this.fill(COLOR);
    }

    moveDown(){
        if(!this.collision(0, 1, this.activeTetromino)){
            this.unDraw();
            this.y++;
            this.Draw();
        }
        else {
            this.lock();
            p = randomPiece();
        }
        
    }

    moveLeft(){
        if(!this.collision(-1, 0, this.activeTetromino)){
            this.unDraw();
            this.x--;
            this.Draw();
        }
    }

    moveRight(){
        if (!this.collision(1, 0, this.activeTetromino)){
            this.unDraw();
            this.x++;
            this.Draw();
        } 
    }

    rotate(){
        let nexPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        let move = 0;

        if(this.collision(0, 0, nexPattern)){
            if(this.x > COL / 2){
                move = -1;
            }
            else{
                move = 1;
            }
        }

        if(!this.collision(0, 0, nexPattern)){
            this.unDraw();
            this.x += move;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.Draw();
        }
    }

    lock(){
        for(let r = 0; r < this.activeTetromino.length; r++){
            for(let c = 0; c < this.activeTetromino.length; c++){
                if(!this.activeTetromino[r][c]){
                    continue
                }

                if(this.y + r < 0){
                    text.style.display = 'block';
                    gameOver = true;
                    break;
                }

                board[this.y + r][this.x + c] = this.color;
            }
        }

        //Xử lý ăn điểm
        for(let r = 0; r < ROW; r++){
            let isFull = true;
            for(let c = 0; c < COL; c++){
                isFull = isFull && (board[r][c] != COLOR)
            }

            if(isFull){
                for(let y = r; y > 1; y--){
                    for(let c = 0; c < COL; c++){
                        board[y][c] = board[y - 1][c];
                    }
                }

                for (let c = 0; c < COL; c++){
                    board[0][c] = COLOR;
                }

                score += 10;
            }
            
        }

        drawBoard();
        document.querySelector('#score').innerText = score;
        document.querySelector('#fn-score').innerText = score;
    }

    collision(x, y, piece){
        for (let r = 0; r < piece.length; r++){
            for(let c = 0; c < piece.length; c++){
                if(!piece[r][c]){
                    continue
                }
                
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                if(newX < 0 || newX >= COL || newY >= ROW){
                    return true
                }

                if(newY < 0){
                    continue
                }

                if(board[newY][newX] != COLOR){
                    return true
                }
                
            }
        }
        return false
    }
}

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

function randomPiece(){
    let r = Math.floor(Math.random() * PIECES.length);
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();

document.addEventListener('keydown', function(e){
    if(e.keyCode == 37){
        p.moveLeft();
    }
    else if(e.keyCode == 39){
        p.moveRight();
    }
    else if(e.keyCode == 38){
        p.rotate();
    }
    else if(e.keyCode == 40){
        p.moveDown();
    }
})

let gameOver = false;
let interval;

function Drop(){
    interval = setInterval(function(){
        if(!gameOver){
            p.moveDown();
        }
        else {
            clearInterval(interval)
        }
        
    }, 1000);
}



start_bt.addEventListener('click', function(){
    text.style.display = 'none';
    gameOver = false;
    for (let r = 0; r < ROW; r++){
        board[r] = [];
        for (let c = 0; c < COL; c++){
            board[r][c] = COLOR;
        }
    }
    p = randomPiece();
    p.x = Math.floor(Math.random() * 6) + 2;
    p.y = -2;
    drawBoard();
    Drop();
    start_bt.innerText = "Restart";
})

let isPause = false;

pause_bt.addEventListener('click', function(){
    text.style.display = 'none';
    if(!isPause){
        gameOver = true;
        ctx.fillStyle = gradient;
        ctx.fillText("Press replay button", 90, 360);
        pause_bt.innerText = "Replay";
        isPause = true;
    }
    else{
        gameOver = false;
        pause_bt.innerText = "Pause";
        isPause = false;
        drawBoard();
        Drop();
    }    
})