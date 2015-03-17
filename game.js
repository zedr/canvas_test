(function (NS) {
  "use strict";

  var canvas,
      world,
      player,
      offset;

  function getCanvasOffset(canvas) {
    var box = canvas.getBoundingClientRect();
    return box.x;
  }

  function World(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.actors = [];
    this.player = null;
  }

  World.prototype.clearCanvas = function () {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  World.prototype.addActor = function (actor) {
    this.actors.push(actor);
  }

  World.prototype.render = function (actor) {
    var pos = actor.position,
        dim = actor.dimensions,
        style = (actor.destination) ? "yellow" : actor.style;
    this.context.fillStyle = style;
    this.context.fillRect(pos[0], pos[1], dim[0], dim[1]);
  }

  World.prototype.renderActors = function () {
    var actorsCount = this.actors.length;
    for (var i = 0; i < actorsCount; i++)
      this.render(this.actors[i]);
  }

  World.prototype.isWithinBounds = function (x, y, l, m) {
    return ((x >= 0 && y >= 0) && (l < this.width && m < this.height))
  }

  World.prototype.positionActor = function (actor, x, y) {
    var pos = actor.position,
        dim = actor.dimensions,
        l = x + dim[0],
        m = y + dim[1];
    if (this.isWithinBounds(x, y, l, m)) {
      actor.position = [x, y];
    }
  }

  World.prototype.moveActor = function (actor) {
    var pos = actor.position,
        dest = actor.destination,
        px = pos[0],
        py = pos[1],
        dx,
        dy,
        x,
        y,
        incr;

    if (dest) {
      dx = dest[0];
      dy = dest[1];
      incr = (dx > px) ? 1 : -1;
      if (px === dx && py == dy) {
        actor.destination = null;
      } else {
        x = px + incr
        y = ((dy - py) * (x - px)) / (dx - px) + py;
        this.positionActor(actor, x, y);
      }
    }
  }
  
  World.prototype.update = function () {
    this.clearCanvas();
    this.moveActor(this.actors[0]);
    this.renderActors();
  }

  World.prototype.tick = function () {
    NS.requestAnimationFrame(this.tick.bind(this));
    this.context.save();
    this.update();
    this.context.restore();
  }

  World.prototype.start = function () {
    this.tick();
  }

  function Actor(name, w, h, px, py) {
    this.name = name;
    this.style = "rgb(200, 0, 0)";
    this.dimensions = [w || 10, h || 10];
    this.position = [px || 0, py || 0];
    this.destination = null;
  }

  Actor.prototype.setDestination = function (x, y) {
    this.destination = [x, y];
  }

  function processMouseClick(x, y) {
    player.setDestination(x, y);
  }

  function bindMouseToCanvas(canvas) {
    canvas.addEventListener('click', function (event) {
      processMouseClick(event.clientX - offset, event.clientY - offset);
    })
  }

  function init() {
    canvas = NS.document.getElementById("target");
    offset = getCanvasOffset(canvas);
    NS.console.log("Found a canvas at " + canvas.width + "x" + canvas.height);
    bindMouseToCanvas(canvas);
    world = new World(canvas);
    player = new Actor("player_1", 10, 10, world.width / 2, world.height / 2);
    world.addActor(player);
    world.player = player;
    world.start();
  }

  NS.onload = init;

}(window));
