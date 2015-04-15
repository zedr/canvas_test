define(["camera"], function (cameraModule) {
  "use strict";

  var Camera = cameraModule.Camera;

  describe("The Camera module", function () {
    it("provides the Camera prototype", function () {
      expect(Camera).toBeDefined();
    });
  });

  describe("The Camera prototype", function () {
    it("can attach to a canvas", function() {
      var canvas = document.createElement("canvas"),
          camera = Camera.create();

      camera.attach(canvas);

      expect(camera.canvas).toEqual(canvas);
      expect(camera.width).toEqual(canvas.width);
      expect(camera.height).toEqual(canvas.height);
      expect(camera.context).toBeDefined();
    });

    it("can clear its context", function () {
      var canvas = document.createElement("canvas"),
          camera = Camera.create().attach(canvas);

      spyOn(camera.context, "clearRect");

      camera.clear();

      expect(camera.context.clearRect)
          .toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
  });

});
