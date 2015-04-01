(function (NS) {
  "use strict";

  NS.onload = function () {
    var game = new NS.Game(),
      canvas = NS.document.getElementById("target");

    game.camera.attach(canvas);
    game.players[0].controller = "mouse";
    //game.start();
    NS.game = game;
  }

}(this));
