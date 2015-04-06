(function (NS) {
  "use strict";

  var LOG = NS.console.log.bind(NS.console),
      gameApp = {
        type: "Game"
      },
      entity = {
        type: "Entity",
        render: function (context) {
        }
      },
      world = Object.create(entity),
      actor = extend(entity, {
        type: "Actor",
        position: {
          x: null,
          y: null
        },
        size: {
          w: 0,
          h: 0
        }
      }),
      camera = Object.create(entity),
      player = Object.create(actor);

  function snapshot(entity) {
    var canvas = NS.document.createElement("canvas"),
        context;

    canvas.width = entity.width;
    canvas.height = entity.height;
    context = canvas.getContext("2d");
    entity.render(context);
    return canvas;
  }

  function extend(entity, attributes) {
    var newEntity = Object.create(entity),
        attr;

    for (attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        newEntity[attr] = attributes[attr];
      }
    }

    return newEntity;
  }

  camera.type = "Camera";
  camera.bindToCanvas = function (canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    return this;
  };
  camera.render = function (entity, useCache) {
    if (useCache === true) {
      if (!entity._cached) {
        entity._cached = snapshot(entity);
      }
      return this.context.drawImage(entity._cached, 0, 0);
    } else {
      return entity.render(this.context);
    }
  };
  camera._update = function () {
    var actors = this.target.actors,
        actorsCount = actors.length,
        context = this.context,
        idx;

    this.render(this.target, true);
    for (idx = 0; idx < actorsCount; idx++) {
      actors[idx].render(context);
    }
  };
  camera.create = function (config) {
    var newCamera = Object.create(this);

    if (config) {
      if (config.canvas) {
        newCamera.bindToCanvas(config.canvas);
      }
    }

    newCamera.update = this._update.bind(newCamera);

    LOG("Initialised Camera with context: " + this.context);
    return newCamera;
  };
  camera.view = function (target) {
    this.target = target;
  };

  player.type = "player";
  player.create = function (config) {
    var newPlayer = Object.create(this);

    newPlayer.name = config.name || "Unnamed Player";

    //if (config.controller === "mouse") ;

    LOG("Created a new player.");
    return newPlayer;
  };

  world.type = "World";
  world.teleport = function (actor, x, y) {
    this.actors.push(actor);
  };
  world.addPlayer = function (player) {
    this.teleport(player, "center", "center");

    LOG("Welcome, " + player.name + ".");
  };
  world.create = function (width, height) {
    var newWorld = Object.create(this);

    newWorld.width = width;
    newWorld.height = height;
    newWorld.actors = [];

    LOG("Created a new world " + width + "x" + height + ".");
    return newWorld;
  };
  world.update = function () {
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
  world.renderBackground = function (context) {
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
  world.render = function (context) {
    this.renderBackground(context);
  };

  gameApp.create = function () {
    var newGame = Object.create(this);

    newGame.world = world.create(1024, 1024);
    newGame.world.addPlayer(player.create({
      controller: "mouse"
    }));

    LOG("Created a new game.");
    return newGame;
  };
  gameApp._tick = function () {
    NS.requestAnimationFrame(this._tick.bind(this));

    this.world.update();
    if (this.camera) {
      this.camera.update();
    }
  };
  gameApp.display = function (canvas) {
    this.camera = camera.create({
      canvas: canvas
    });
    this.camera.view(this.world);
    return this;
  };
  gameApp.start = function () {
    this._tick();

    LOG("Game started!");
  };

  NS.gameApp = gameApp;

}(this));
