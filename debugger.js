(function(NS) {
  "use strict";

  var LOG = NS.App.Utils.LOG,
    extend = NS.App.Utils.extend,
    Actor = NS.App.Entities.Actor,
    Debugger = extend(Actor, {
      position: {
        x: 10,
        y: 10
      },
      targets: []
    });

  Debugger.watch = function() {
    this.targets = Array.prototype.slice.call(arguments);
  };

  Debugger.log = function(message, offset, context) {
    context.fillStyle = "rgb(0, 128, 32)";
    context.fillText(message, 0, this.position.y + offset);
  };

  Debugger.render = function(context) {
    var targets = this.targets,
      targetsCount = targets.length,
      target,
      idx;

    for (idx = 0; idx < targetsCount; idx++) {
      this.log(targets[idx].describe(), idx * 10, context);
    }
  };

  NS.App.Debugger = Debugger;

}(this));
