(function (NS) {
  "use strict";

  var abs = Math.abs,
      sqrt = Math.sqrt;

  function World(x, y) {
    this.actors = [];
    this.player = null;
    this.size = {
      x: x,
      y: y
    }
  }

  World.prototype.drawGrid = function (context) {
    for (var x = 0.5; x < this.width; x += 10) {
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
    }

    for (var y = 0.5; y < this.height; y += 10) {
      context.moveTo(0, y);
      context.lineTo(this.width, y);
    }

    context.strokeStyle = "#333333";
    context.stroke();
  }

  World.prototype.createGridImage = function () {
    var cnvs = NS.document.createElement("canvas"),
        ctxt;

    cnvs.width = this.width;
    cnvs.height = this.height;
    ctxt = cnvs.getContext("2d");
    this.drawGrid(ctxt);
    return cnvs;
  }

  World.prototype.loadCanvas = function (canvas) {
    this.width = this.size.x || canvas.width;
    this.height = this.size.y || canvas.height;
    this.context = canvas.getContext("2d");
  }

  World.prototype.clearContext = function () {
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

    for (var i = 0; i < actorsCount; i++) {
      this.render(this.actors[i]);
    }
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
    } else {
      // Stop the actor
      actor.destination = null;
    }
  }

  World.prototype.moveActor = function (actor) {
    var pos = actor.position,
        dest = actor.destination,
        speed = actor.speed,
        px = pos[0],
        py = pos[1],
        len,
        dx,
        dy,
        x,
        y;

    if (dest) {
      dx = dest[0];
      dy = dest[1];
      if (abs(px - dx) < 2 && abs(py - dy) < 2) {
        actor.destination = null;
      } else {
        x = dx - px;
        y = dy - py;
        len = sqrt(x * x + y * y);
        x /= len;
        y /= len;
        x *= speed;
        y *= speed;
        this.positionActor(actor, px + x, py + y);
      }
    }
  }

  World.prototype.renderBackground = function () {
    this.context.drawImage(this._bg, 0, 0);
  }
  
  World.prototype.update = function () {
    this.clearContext();
    this.renderBackground();
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
    this._bg = this.createGridImage();
    this.tick();
  }
  
  function Actor(name, w, h, px, py) {
    this.name = name;
    this.style = "rgb(200, 0, 0)";
    this.dimensions = [w || 10, h || 10];
    this.position = [px || 0, py || 0];
    this.speed = 4;
    this.destination = null;
  }

  Actor.prototype.setDestination = function (x, y) {
    var a = x - (this.dimensions[0] / 2),
        b = y - (this.dimensions[1] / 2);

    this.destination = [a, b];
  }

  function Game() {
    this.world = new World();
  }

  Game.prototype.getCanvasOffset = function () {
    var box = this.canvas.getBoundingClientRect();

    // x for Firefox, left for Chrome
    return box.x || box.left; 
  }

  Game.prototype.setCanvas = function (canvas) {
    if (canvas) {
      this.canvas = canvas;
      this.world.loadCanvas(canvas);
      this.offset = this.getCanvasOffset();
    }
  }

  Game.prototype.handleClick = function (event) {
    var offset = this.offset,
        x = event.clientX - offset, 
        y = event.clientY - offset;

    this.world.player.setDestination(x, y);
  }

  Game.prototype.bindController = function (name) {
    if (name === "mouse") {
      this.canvas.addEventListener("click", this.handleClick.bind(this));
      this.canvas.oncontextmenu = function (event) {event.preventDefault();};
    }
  }

  Game.prototype.start = function () {
    var world = this.world,
        player = new Actor("p1", 10, 10, world.width / 2, world.height / 2)

    if (world.context) {
      world.addActor(player);
      world.player = player;
      world.start();
    } else {
      throw("Please set a canvas first.");
    }
  }


  NS.Resources = {
    "Game": Game
  };

}(this));
