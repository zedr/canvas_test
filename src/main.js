require(["game"], function (gameModule) {
  "use strict";

  var canvas = document.getElementById("target"),
      game = gameModule.Game.create();

  game.display(canvas).control(1, "mouse").start();

});
