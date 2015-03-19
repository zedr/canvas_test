(function (NS) {
  "use strict";

  var abs = Math.abs,
      sqrt = Math.sqrt;

  function World() {
    this.actors = [];
    this.player = null;
  }
  
  World.prototype.loadCanvas = function (canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
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
    } else {
      // Stop the actor
      actor.destination = null;
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
        len,
        speed = actor.speed;

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
  
  World.prototype.update = function () {
    this.clearContext();
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
    this.speed = 4;
    this.destination = null;
  }

  Actor.prototype.setDestination = function (x, y) {
    var a = this.dimensions[0] / 2,
        b = this.dimensions[1] / 2;

    this.destination = [x - a, y - b];
  }

  NS.Resources = {
    "Actor": Actor,
    "World": World
  };

}(this));
