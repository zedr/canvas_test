(function(NS, undefined) {
  "use strict";

  var LOG = NS.App.Utils.LOG,
      World = NS.App.World,
      Player = NS.App.Entities.Player,
      Debugger = NS.App.Debugger,
      Camera = NS.App.Camera,
      Game = {
        type: "Game"
      };

  Game.create = function() {
    var newGame = Object.create(this),
        newWorld = World.create(1024, 1024),
        newPlayer = Player.create(),
        debugger_;

    newGame.players = [];
    newGame.world = newWorld;
    newGame.addPlayer(newPlayer);
    debugger_ = Object.create(Debugger);
    debugger_.watch(newWorld, newPlayer);
    newGame.world.actors.push(debugger_);

    LOG("Created a new game.");
    return newGame;
  };

  Game.addPlayer = function(player) {
    var world = this.world,
        playerNo;

    world.actors.push(player);
    this.players.push(player);
    world.teleport(player, 100, 100);
    playerNo = this.players.length;

    LOG("Welcome, player " + playerNo + ": " + player.name + ".");
  };

  Game._tick = function() {
    NS.requestAnimationFrame(this._tick.bind(this));

    this.world.update();
    if (this.camera) {
      this.camera.update();
    }
  };

  Game.display = function(canvas) {
    this.camera = Camera.create({
      canvas: canvas
    });
    this.camera.view(this.world);
    return this;
  };

  Game.control = function(playerNo, type) {
    var player = this.players[playerNo - 1];

    if (player) {
      if (type === "mouse") {
        this.camera.bindMouse(player);
      }
    } else {
      LOG("No such player " + playerNo + ".");
    }
    return this;
  };

  Game.start = function() {
    this._tick();

    LOG("Game started!");
  };

  NS.App.Game = Game;

}(this));
