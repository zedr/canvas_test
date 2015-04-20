define(["camera", "entities"], function (cameraModule, entitiesModule) {
  "use strict";

  var Camera = cameraModule.Camera;

  describe("The Camera module", function () {
    it("provides the Camera prototype", function () {
      expect(Camera).toBeDefined();
    });
  });

  describe("The Camera prototype", function () {
    var canvas = document.createElement("canvas"),
        camera = Camera.create().attach(canvas);

    it("is attached to a canvas", function () {
      expect(camera.canvas).toEqual(canvas);
      expect(camera.width).toEqual(canvas.width);
      expect(camera.height).toEqual(canvas.height);
      expect(camera.context).toBeDefined();
    });

    it("can clear its context", function () {
      spyOn(camera.context, "clearRect");
      camera.clear();
      expect(camera.context.clearRect)
          .toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
      camera.context.clearRect.isSpy = false;
    });

    it("can focus on a position", function () {
      var x = canvas.width,
          y = canvas.height;

      camera.focus = {x: x, y: y};
    });

    it("can focus on an actor", function () {
      var actor = entitiesModule.Actor.create();

      camera.focusOn(actor);
      expect(camera.focus).toEqual(actor.position);
    });
  });
});
