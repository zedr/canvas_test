(function (NS) {
  "use strict";

  var 
      World = NS.Resources.World,
      Actor = NS.Resources.Actor,
      canvas,
      world,
      player;

  function getCanvasOffset (canvas) {
    var box = canvas.getBoundingClientRect();
    // x for Firefox, left for Chrome
    return box.x || box.left; 
  }

  function processMouseClick(x, y) {
    player.setDestination(x, y);
  }

  function bindMouseToCanvas(canvas) {
    var offset = getCanvasOffset(canvas);
    canvas.addEventListener('click', function (event) {
      processMouseClick(event.clientX - offset, event.clientY - offset);
    })
  }

  function init() {
    canvas = NS.document.getElementById("target");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    NS.console.log("Found a canvas at " + canvas.width + "x" + canvas.height);
    bindMouseToCanvas(canvas);
    world = new World();
    world.loadCanvas(canvas);
    player = new Actor("player_1", 10, 10, world.width / 2, world.height / 2);
    world.addActor(player);
    world.player = player;
    world.start();
  }

  NS.onload = init;

}(this));
