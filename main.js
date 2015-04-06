(function(NS) {
  "use strict";

  NS.onload = function() {
    var myGame = NS.gameApp.create(),
      canvas = NS.document.getElementById("target");

    myGame.display(canvas).start();
    NS.myGame = myGame;
  }

}(this));
