define("debug", ["entities"], function (entitiesModule) {
  "use strict";

  var Debugger = entitiesModule.Actor.extend({
    position: {
      x: 10,
      y: 10
    },
    targets: []
  });

  Debugger.watch = function () {
    this.targets = Array.prototype.slice.call(arguments);
  };

  Debugger.renderDebugMessage = function (message, offset, context) {
    context.fillStyle = "rgb(0, 128, 32)";
    context.fillText(message, 0, this.position.y + offset);
  };

  Debugger.render = function (context) {
    var targets = this.targets,
        targetsCount = targets.length,
        idx;

    for (idx = 0; idx < targetsCount; idx++) {
      this.renderDebugMessage(targets[idx].describe(), idx * 10, context);
    }
  };

  return {
    Debugger: Debugger
  };

});
