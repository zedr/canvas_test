(function (NS) {
  "use strict";

  NS.onload = function () {
    var gameApp = new NS.Resources.Game(),
      canvas = NS.document.getElementById("target");

    gameApp.setCanvas(canvas);
    gameApp.bindController("mouse");
    gameApp.start();
  }

}(this));
