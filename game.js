// Canvas & context setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 14;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 10;
const PADDLE_MARGIN = 18;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Paddle & Ball state
let leftPaddleY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let rightPaddleY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = CANVAS_WIDTH / 2;
let ballY = CANVAS_HEIGHT / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

const AI_SPEED = 4;

// Mouse controls left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp within bounds
    leftPaddleY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, leftPaddleY));
});

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = '#fff6';
    ctx.lineWidth = 4;
    for (let i = 0; i < CANVAS_HEIGHT; i += 36) {
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2, i);
        ctx.lineTo(CANVAS_WIDTH / 2, i + 18);
        ctx.stroke();
    }
}

// Reset ball after a point
function resetBall() {
    ballX = CANVAS_WIDTH / 2;
    ballY = CANVAS_HEIGHT / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Update AI paddle
function updateAIPaddle() {
    const paddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;
    if (ballY < paddleCenter - 18) {
        rightPaddleY -= AI_SPEED;
    } else if (ballY > paddleCenter + 18) {
        rightPaddleY += AI_SPEED;
    }
    // Clamp within bounds
    rightPaddleY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, rightPaddleY));
}

// Update ball position and check collisions
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + BALL_RADIUS > CANVAS_HEIGHT) {
        ballY = CANVAS_HEIGHT - BALL_RADIUS;
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (
        ballX - BALL_RADIUS <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_RADIUS >= leftPaddleY &&
        ballY - BALL_RADIUS <= leftPaddleY + PADDLE_HEIGHT &&
        ballSpeedX < 0
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH + BALL_RADIUS;
        ballSpeedX = -ballSpeedX;
        // Add paddle effect
        let hitPos = (ballY - (leftPaddleY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 4;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_RADIUS >= CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_RADIUS >= rightPaddleY &&
        ballY - BALL_RADIUS <= rightPaddleY + PADDLE_HEIGHT &&
        ballSpeedX > 0
    ) {
        ballX = CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_RADIUS;
        ballSpeedX = -ballSpeedX;
        // Add paddle effect
        let hitPos = (ballY - (rightPaddleY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += hitPos * 4;
    }

    // Left or right wall: reset
    if (ballX < 0 || ballX > CANVAS_WIDTH) {
        resetBall();
    }
}

// Main game loop
function gameLoop() {
    // Update state
    updateAIPaddle();
    updateBall();

    // Draw
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawNet();
    drawRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, '#0cf');
    drawRect(CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fc0');
    drawCircle(ballX, ballY, BALL_RADIUS, '#fff');

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
