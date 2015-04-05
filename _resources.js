(function (NS, undefined) {
  "use strict";

  var LOG = NS.console.log.bind(NS.console);

  function snapshot(entity, context, renderer) {
    var canvas = NS.document.createElement("canvas"),
      context;

    canvas.width = entity.width;
    canvas.height = entity.height;
    context = canvas.getContext("2d");
    renderer.call(entity, context);
    return canvas;
  }

  function Entity(type) {
    this.name = "Unnamed";
    this.type = "Entity";
  }

  Entity.prototype.render = function () {}

  function Actor() {
    this.position = {};
    this.type = "Actor";
  }

  Actor.prototype = new Entity();

  function Player(name) {
    this.name = (name === undefined) ? "Unnamed Player" : name;
    this.type = "Player";

    LOG("Initialised Player: " + this.name);
  }

  Player.prototype = new Actor();

  function Debugger() {
    this.type = "Debugger";
    this.targets = Array.prototype.slice.call(arguments, 0);
    this.position = {
      x: 10,
      y: 10
    }
  }

  Debugger.prototype = new Entity("Debugger");

  Debugger.prototype.renderPlayer = function (player, context, offset) {
    var pos = this.position,
      posY = pos.y + (offset * 10),
      pPos = player.position;

    context.fillStyle = "rgb(0, 128, 32)";
    context.fillText(
      "Player: " + pPos.x + ", " + pPos.y, pos.x, posY
    );
  }

  Debugger.prototype.renderWorld = function (world, context, offset) {
    context.fillStyle = "rgb(0, 128, 32)";
    context.fillText(
      "World: " + world.width + "x" + world.height, 10, 35
    );
  }

  Debugger.prototype.render = function (context) {
    var targetsCount = this.targets.length,
      entity,
      idx;

    for (idx = 0; idx < targetsCount; idx++) {
      entity = this.targets[idx];
      if (typeof entity.render === "function")
        if (entity.type === "Player")
          this.renderPlayer(entity, context, idx);
        else if (entity.type === "World")
          this.renderWorld(entity, context, idx);
    }
  }

  function Camera(observed) {
    this.target = observed;
  }

  Camera.prototype.attach = function(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;

    this.context = canvas.getContext("2d");

    LOG("Initialised Camera with context: " + this.context);
  }

  Camera.prototype.render = function() {
    var actors = this.target.actors,
      actorsCount = actors.length,
      context = this.context,
      idx;

    this.context.save();

    this.target.render(context);
    for (idx = 0; idx < actorsCount; idx++)
      actors[idx].render(context);

    this.context.restore();
  }

  function World(width, height) {
    this.type = "World";
    this.width = width;
    this.height = height;
    this.actors = [];

    LOG("Initialised World: " + width + "x" + height);
  }

  World.prototype = new Entity("World");

  World.prototype.move = function (actor) {
  }

  World.prototype.update = function () {
    var actorsCount = this.actors.length,
      actor,
      idx;

    for (idx = 0; idx < actorsCount; idx++) {
      actor = this.actors[idx];
      this.move(actor);
    }
  }

  World.prototype.renderBackground = function (context) {
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

  World.prototype.render = function (context, offsetX, offsetY) {
    var renderer;

    if (typeof this.image === "undefined") {
      renderer = this.renderBackground.bind(this);
      this.image = snapshot(this, context, renderer);
    }
    context.drawImage(this.image, offsetX || 0, offsetY || 0);
  }

  function Game() {
    this.world = new World(1024, 1024);
    this.players = [];

    this.camera = new Camera(this.world);

    LOG("Initialised Game: " + this);
  }

  Game.prototype._tick = function () {
    NS.requestAnimationFrame(this._tick.bind(this));

    this.world.update();
    this.camera.render();
  }

  Game.prototype.start = function () {
    this._tick();
  }

  Game.prototype.addPlayer = function (name) {
    var player = new Player(name),
      debug = new Debugger(this.world, player);

    player.position = {x: 50, y: 50};

    this.world.actors.push(player);
    this.world.actors.push(debug);
    this.players.push(player);

    LOG("Welcome, " + player.name);
  }

  NS.Game = Game;
  
}(this));
