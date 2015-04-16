define(["utils", "entities"], function (utilsModule, entitiesModule) {
  "use strict";

  var Camera = entitiesModule.Entity.extend({
    type: "Camera"
  });

  function handleClick(offset, event) {
    // jshint -W040: this is called after being bound to an actor.
    this.destination = {
      x: event.clientX - offset,
      y: event.clientY - offset
    };
  }

  Camera.attach = function (canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
    return this;
  };

  Camera.bindMouse = function (actor) {
    var canvas = this.canvas,
        offset = utilsModule.getOffset(canvas);

    canvas.addEventListener("click", handleClick.bind(actor, offset));
    canvas.oncontextmenu = function (event) {
      event.preventDefault();
    };
  };

  Camera.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  Camera.draw = function (entity) {
    if (!entity._cached) {
      entity._cached = utilsModule.snapshot(entity);
    }
    return this.context.drawImage(entity._cached, 0, 0);
  };

  Camera.view = function (target) {
    this.target = target;
    return this;
  };

  Camera._update = function () {
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

  Camera.create = function (config) {
    var newCamera = Object.create(this);

    if (config) {
      if (config.canvas) {
        newCamera.attach(config.canvas);
      }
    }

    newCamera.update = utilsModule.efficiently(this._update.bind(newCamera));

    utilsModule.LOG("Initialised Camera with context: " + this.context);
    return newCamera;
  };

  return {
    Camera: Camera
  };

});
