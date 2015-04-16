define(["window", "game"], function (NS, gameModule) {
  "use strict";

  var Game = gameModule.Game;

  describe("The Game module", function () {
    it("provides the Game prototype", function () {
      expect(Game).toBeDefined();
    });
  });

  describe("The Game prototype", function () {
    var gameConfig = {};

    it("can create a new game", function () {
      var game = Game.create(gameConfig);

      expect(game).toBeDefined();
    });

    it("can display the game on a canvas", function () {
      var game = Game.create(gameConfig),
          canvas = NS.document.createElement("canvas");

      expect(game.display(canvas).start()).toEqual(true);
    });
  });
});
