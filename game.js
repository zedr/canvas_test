(function (NS) {
  "use strict";

  NS.onload = function () {
    NS.gameApp = new NS.Resources.Game();
    NS.gameApp.setCanvas(NS.document.getElementById("target"));
    NS.gameApp.bindController("mouse");
    NS.gameApp.start();
  }

}(this));
