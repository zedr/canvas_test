//noinspection OverlyComplexFunctionJS
define("game", ["window", "utils", "world", "camera", "entities", "debug"],
    function (NS,
              utilsModule, worldModule, cameraModule, entitiesModule,
              debuggerModule) {
  "use strict";

  var Game = {
    type: "Game"
  };

  Game.create = function () {
    var newGame = Object.create(this),
        newWorld = worldModule.World.create(1024, 1024),
        newPlayer = entitiesModule.Player.create(),
        debug = Object.create(debuggerModule.Debugger);

    newGame.players = [];
    newGame.world = newWorld;
    newGame.addPlayer(newPlayer);
    debug.watch(newWorld, newPlayer);
    newGame.world.actors.push(debug);

    utilsModule.LOG("Created a new game.");
    return newGame;
  };

  Game.addPlayer = function (player) {
    var world = this.world,
        playerCount;

    world.actors.push(player);
    this.players.push(player);
    world.teleport(player, 100, 100);
    playerCount = this.players.length;

    utilsModule.LOG("Welcome, player " + playerCount + ": " + player.name + ".");
  };

  Game._tick = function () {
    NS.window.requestAnimationFrame(this._tick.bind(this));

    this.world.update();
    if (this.camera) {
      this.camera.update();
    }
  };

  Game.display = function (canvas) {
    this.camera = cameraModule.Camera.create({
      canvas: canvas
    });
    this.camera.view(this.world);
    return this;
  };

  Game.control = function (playerNo, type) {
    var player = this.players[playerNo - 1];

    if (player) {
      if (type === "mouse") {
        this.camera.bindMouse(player);
      }
    } else {
      utilsModule.LOG("No such player " + playerNo + ".");
    }
    return this;
  };

  Game.start = function () {
    this._tick();

    utilsModule.LOG("Game started!");
    return true;
  };

  return {
    Game: Game
  };

});
