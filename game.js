(function (NS) {
  "use strict";

  var canvas,
      world,
      player;

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
        dim = actor.dimensions;
    this.context.fillStyle = (actor.style || "black");
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

  World.prototype.moveActor = function (actor, a, b) {
    var pos = actor.position,
        dim = actor.dimensions,
        x = pos[0] + a,
        y = pos[1] + b,
        l = x + dim[0],
        m = y + dim[1];
    if (this.isWithinBounds(x, y, l, m))
      actor.position = [x, y];
  }
  
  World.prototype.update = function () {
    this.clearCanvas();
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
  }

  function bindMouseToCanvas(canvas) {
    canvas.addEventListener('click', function (event) {
      NS.console.log(event.clientX, event.clientY, canvas.getBoundingClientRect());
    })
  }

  function init() {
    canvas = NS.document.getElementById("target");
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
