var mario = document.getElementById("mario");
var pipe = document.getElementById("pipe");
var mushroom = document.getElementById("mushroom");
var score = document.getElementById("score");
var backgroundMusic = document.getElementById("background-music");
var jumpSound = document.getElementById("jump-sound");
var startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", function () {
  backgroundMusic.play();
  startBtn.style.display = "none";
  document.getElementById("game-container").style.display = "block";
  startGame();
});

function startGame() {
  var marioJumping = false;
  var marioMovingRight = false;
  var marioMovingLeft = false;
  var obstacles = [pipe, mushroom];
  var gameScore = 0;
  var gameContainerWidth =
    document.getElementById("game-container").offsetWidth;
  var marioPosition = 5;

  // jumping function
  function jump() {
    if (!marioJumping) {
      marioJumping = true;
      jumpSound.play();

      var startPos = 32;
      var endPos = 230;
      var speed = 15;

      var jumpInterval = setInterval(function () {
        if (startPos < endPos) {
          startPos += speed;
          mario.style.bottom = startPos + "px";
        } else {
          clearInterval(jumpInterval);
          fall();
        }
      }, 20);
    }
  }

  // fall function
  function fall() {
    var startPos = 230;
    var endPos = 32;
    var speed = 12;

    var fallInterval = setInterval(function () {
      if (startPos > endPos) {
        startPos -= speed;
        mario.style.bottom = startPos + "px";
      } else {
        clearInterval(fallInterval);
        marioJumping = false;
      }
    }, 20);
  }
  // move mario function
  function moveMario(direction) {
    var proposedPosition = marioPosition + (direction === "right" ? 20 : -20);
    var maxMarioPosition = gameContainerWidth - mario.offsetWidth; // mario.offsetWidth gives the width of the mario element
    if (proposedPosition >= 0 && proposedPosition <= maxMarioPosition) {
      marioPosition = proposedPosition;
      mario.style.left = marioPosition + "px";
      if (direction === "right") {
        mario.classList.remove("flipped");
      } else {
        mario.classList.add("flipped");
      }
    }
  }

  // check collision
  function checkCollision(obstaclePos) {
    return obstaclePos < marioPosition + 70 && obstaclePos > marioPosition;
  }
  //moving obstacle function
  function moveObstacle(obstacle) {
    var obstaclePos = gameContainerWidth;
    obstacle.style.left = obstaclePos + "px"; // set initial position
    var obstacleTimer = setInterval(function () {
      if (obstaclePos < 0) {
        // obstacle position is less than game container
        obstacle.style.display = "none";
        obstaclePos = gameContainerWidth;
        setTimeout(() => {
            obstacle.style.display = "block";
          }, 100);
        gameScore++; //incrementing gamescore
        score.innerText = gameScore;
       
      } else if (checkCollision(obstaclePos) && marioJumping) {
        //collision occured and mariojumping
        obstaclePos -= 10;
      } else if (checkCollision(obstaclePos) && !marioJumping) {
        // collision occured and mario not jumping
        clearInterval(obstacleTimer);
        score.innerText = "game over ! Score" + gameScore;
        obstacles.forEach(function (obstacle) {
          obstacle.style.animationPlayState = "paused";
        });
        if (confirm("Game Over!")) {
          location.reload();
        } else {
          location.reload();
        }
      } else {
        obstaclePos -= 10;
      }
      obstacle.style.left = obstaclePos + "px";
    }, Math.random() * (200 - 50) + 50);
  }
  // keyboard events
  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case " ":
        jump();
        break;
      case "ArrowRight":
        marioMovingRight = true;
        break;
      case "ArrowLeft":
        marioMovingLeft = true;
        break;
    }
  });

  window.addEventListener("keyup", function (event) {
    switch (event.key) {
      case "ArrowRight":
        marioMovingRight = false;
        break;
      case "ArrowLeft":
        marioMovingLeft = false;
        break;
    }
  });

  //calling move mario function
  setInterval(function () {
    if (marioMovingRight) {
      moveMario("right");
    } else if (marioMovingLeft) {
      moveMario("left");
    }
  }, 100);

  //calling each obstacle
  obstacles.forEach(function (obstacle, index) {
    setTimeout(function () {
      obstacle.style.display = "block";
      moveObstacle(obstacle);
    }, index * 2000);
  });
}
