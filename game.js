(function (NS) {
  "use strict";

  var canvas,
      context,
      sx = 0,
      sy = 0,
      sw = 50,
      sh = 50,
      increment = 4,
      speed = 0,
      termVel = 50,
      ship,
      shipUrl = "ship.png";

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawGrid() {
    for (var x = 10.5; x < canvas.width; x += 10) {
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
    }
    context.strokeStyle = "rgb(100, 100, 100)";
    context.stroke();
  }

  function drawSquare() {
    context.fillStyle = "rgb(200, 0, 0)";
    context.fillRect(sx, sy, sw, sh);
  }

  function isInBounds() {
    return ((sx + sw < canvas.width) && (sy + sh < canvas.height))
  }

  function processKeys(event) {
    var code = event.keyCode;

    if (code == 37) {
      sx -= increment;
    } else if (code == 38) {
      sy -= increment;
    } else if (code === 39) {
      sx += increment;
    } else if (code === 40) {
      sy += increment;
    }
  }

  function applyGravity() {
    if (speed < termVel)
      speed++;
    if (sy < canvas.height)
      sy += speed;
  }

  function displayDebugText() {
    context.font = "bold 12px sans-serif";
    context.fillText("Hello", 250, 50);
  }

  function loadShip () {
    ship = new Image();
    ship.src = shipUrl;
  }

  function drawShip() {
    context.drawImage(ship, 400, 50);
  }

  function tick() {
    NS.requestAnimationFrame(tick);
    context.save();
    clearCanvas();
    drawSquare();
    drawShip();
    //applyGravity();
    displayDebugText();
    context.restore();
  }

  function init() {
    canvas = NS.document.getElementById("target");
    NS.console.log("Found canvas " + canvas.width + "x" + canvas.height);
    context = canvas.getContext("2d");
    NS.document.onkeypress = processKeys;
    tick();
  }

  loadShip();
  NS.onload = init;

}(window));
