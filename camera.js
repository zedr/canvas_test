(function(NS) {
  "use strict";

  var LOG = NS.App.Utils.LOG,
      extend = NS.App.Utils.extend,
      efficiently = NS.App.Utils.efficiently,
      getOffset = NS.App.Utils.getOffset,
      handleClick = NS.App.Utils.handleClick,
      snapshot = NS.App.Utils.snapshot,
      Entity = NS.App.Entities.Entity,
      Camera = extend(Entity, {
        type: "Camera"
      });

  Camera.attach = function(canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
    return this;
  };

  Camera.bindMouse = function(actor) {
    var canvas = this.canvas,
        offset = getOffset(canvas);

    canvas.addEventListener("click", handleClick.bind(actor, offset));
    canvas.oncontextmenu = function(event) {
      event.preventDefault();
    };
  };

  Camera.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  Camera.draw = function(entity) {
    if (!entity._cached) {
      entity._cached = snapshot(entity);
    }
    return this.context.drawImage(entity._cached, 0, 0);
  };

  Camera.view = function(target) {
    this.target = target;
  };

  Camera._update = function() {
    var actors = this.target.actors,
        actorsCount = actors.length,
        context = this.context,
        idx;

    this.clear();
    this.draw(this.target);
    for (idx = 0; idx < actorsCount; idx++) {
      actors[idx].render(context);
    }
  };

  Camera.create = function(config) {
    var newCamera = Object.create(this);

    if (config) {
      if (config.canvas) {
        newCamera.attach(config.canvas);
      }
    }

    newCamera.update = efficiently(this._update.bind(newCamera));

    LOG("Initialised Camera with context: " + this.context);
    return newCamera;
  };

  NS.App.Camera = Camera;

}(this));
