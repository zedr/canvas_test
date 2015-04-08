(function(NS) {
  "use strict";

  var LOG = NS.console.log.bind(NS.console),
    gameApp = {
      type: "Game"
    },
    entity = {
      type: "Entity",
      render: function(context) {},
      describe: function() {
        return this.type;
      }
    },
    world = extend(entity, {
      describe: function() {
        return this.type + " (" + this.width + "x" + this.height + ")";
      }
    }),
    actor = extend(entity, {
      type: "Actor",
      position: {
        x: null,
        y: null
      },
      dimensions: {
        w: 0,
        h: 0
      },
      describe: function() {
        var pos = this.position;

        return this.type + " (" + pos.x + ", " + pos.y + ")";
      }
    }),
    camera = Object.create(entity),
    player = extend(actor, {
      dimensions: {
        w: 5,
        h: 5
      }
    }),
    debug = extend(actor, {
      position: {
        x: 10,
        y: 10
      },
      targets: []
    });

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

  function efficiently(callback) {
    return function() {
      this.context.save();
      callback();
      this.context.restore();
    };
  }

  camera.type = "Camera";
  camera.attach = function(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    return this;
  };
  camera.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  };
  camera.draw = function(entity) {
    if (!entity._cached) {
      entity._cached = snapshot(entity);
    }
    return this.context.drawImage(entity._cached, 0, 0);
  };
  camera._update = function() {
    var actors = this.target.actors,
      actorsCount = actors.length,
      context = this.context,
      idx;

    this.clear();
    this.draw(this.target);
    for (idx = 0; idx < actorsCount; idx++) {
      actors[idx].render(context);
    }
  };
  camera.create = function(config) {
    var newCamera = Object.create(this);

    if (config) {
      if (config.canvas) {
        newCamera.attach(config.canvas);
      }
    }

    newCamera.update = efficiently(this._update.bind(newCamera));

    LOG("Initialised Camera with context: " + this.context);
    return newCamera;
  };
  camera.view = function(target) {
    this.target = target;
  };

  player.type = "player";
  player.create = function(config) {
    var newPlayer = Object.create(this);

    newPlayer.name = config.name || "Unnamed Player";

    //if (config.controller === "mouse") ;

    LOG("Created a new player.");
    return newPlayer;
  };
  player.render = function(context) {
    var pos = this.position,
      dim = this.dimensions,
      style = "rgb(255, 0, 0)";

    context.fillStyle = style;
    context.fillRect(pos.x, pos.y, dim.w, dim.h);
  };

  world.type = "World";
  world.teleport = function(actor, x, y) {
    if (x === "center") {
      x = this.width / 2;
    }
    if (y === "center") {
      y = this.height / 2;
    }
    actor.position.x = x;
    actor.position.y = y;
    this.actors.push(actor);
  };
  world.move = function(actor, x, y) {
  };
  world.addPlayer = function(player) {
    this.teleport(player, 100, 100);

    LOG("Welcome, " + player.name + ".");
  };
  world.create = function(width, height) {
    var newWorld = Object.create(this);

    newWorld.width = width;
    newWorld.height = height;
    newWorld.actors = [];

    LOG("Created a new world " + width + "x" + height + ".");
    return newWorld;
  };
  world.update = function() {
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
  world.renderBackground = function(context) {
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
  world.render = function(context) {
    this.renderBackground(context);
  };

  debug.watch = function() {
    this.targets = Array.prototype.slice.call(arguments);
  };

  debug.log = function(message, offset, context) {
    context.fillStyle = "rgb(0, 128, 32)";
    context.fillText(message, 0, this.position.y + offset);
  };

  debug.render = function(context) {
    var targets = this.targets,
      targetsCount = targets.length,
      target,
      idx;

    for (idx = 0; idx < targetsCount; idx++) {
      this.log(targets[idx].describe(), idx * 10, context);
    }
  };

  gameApp.create = function() {
    var newGame = Object.create(this),
      newWorld = world.create(1024, 1024),
      newPlayer = player.create({
        controller: "mouse"
      }),
      debugger_;

    newGame.world = newWorld;
    newGame.world.addPlayer(newPlayer);
    debugger_ = Object.create(debug);
    debugger_.watch(newWorld, newPlayer);
    newGame.world.actors.push(debugger_);

    LOG("Created a new game.");
    return newGame;
  };
  gameApp._tick = function() {
    NS.requestAnimationFrame(this._tick.bind(this));

    this.world.update();
    if (this.camera) {
      this.camera.update();
    }
  };
  gameApp.display = function(canvas) {
    this.camera = camera.create({
      canvas: canvas
    });
    this.camera.view(this.world);
    return this;
  };
  gameApp.start = function() {
    this._tick();

    LOG("Game started!");
  };

  NS.gameApp = gameApp;

}(this));
