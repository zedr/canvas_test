(function(NS) {
  "use strict";

  NS.onload = function() {
    var game = NS.App.Game.create(),
      canvas = NS.document.getElementById("target");

    game.display(canvas).control(1, "mouse").start();

    NS.currentGame = game;
  }

}(this));
