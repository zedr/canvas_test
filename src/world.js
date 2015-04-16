define("world", ["utils", "entities"], function (Utils, Entities) {
  "use strict";

  var World = Entities.Entity.extend({
    type: "World",
    describe: function () {
      return this.type + " (" + this.width + "x" + this.height + ")";
    }
  });

  World.isWithinBounds = function (x, y) {
    return ((x >= 0 && y >= 0) && (x < this.width && y < this.height))
  };

  World.teleport = function (actor, x, y) {
    if (x === "center") {
      x = this.width / 2;
    }
    if (y === "center") {
      y = this.height / 2;
    }
    if (this.isWithinBounds(x, y)) {
      actor.position.x = x;
      actor.position.y = y;
    }
  };

  World.move = function (actor) {
    var pos = actor.position,
        dest = actor.destination,
        speed = actor.speed,
        px = pos.x,
        py = pos.y,
        len,
        dx,
        dy,
        x,
        y;

    if (dest && speed > 0) {
      dx = dest.x;
      dy = dest.y;
      if (Math.abs(px - dx) < speed && Math.abs(py - dy) < speed) {
        actor.destination = null
      } else {
        x = dx - px;
        y = dy - py;
        len = Math.sqrt(x * x + y * y);
        x /= len;
        y /= len;
        x *= speed;
        y *= speed;
        this.teleport(actor, px + x, py + y);
      }
    }
  };

  World.create = function (width, height) {
    var newWorld = Object.create(this);

    newWorld.width = width;
    newWorld.height = height;
    newWorld.actors = [];

    Utils.LOG("Created a new world " + width + "x" + height + ".");
    return newWorld;
  };

  World.update = function () {
    var actorsCount = this.actors.length,
        actor,
        idx;

    for (idx = 0; idx < actorsCount; idx++) {
      actor = this.actors[idx];
      if (actor.destination) {
        this.move(actor);
      }
    }
  };

  World.renderBackground = function (context) {
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
  };

  World.render = function (context) {
    this.renderBackground(context);
  };

  return {
    World: World
  };

});
