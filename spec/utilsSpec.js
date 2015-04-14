define(["utils"], function (Utils) {
  "use strict";

  var moduleExports = [
    "snapshot",
    "extend",
    "efficiently",
    "getOffset",
    "LOG"
  ];

  describe("The Utilities", function () {
    var canvasObject = {
      width: 50,
      height: 50,
      render: function (context) {
        context.fillStyle = "rgb(0, 128, 32)";
        context.fillText("tested", 0, 0);
      }
    };

    it("provides all the utility functions on the App namespace", function () {
      for (var idx = 0; idx < moduleExports.length; idx++) {
        expect(typeof Utils[moduleExports[idx]]).toEqual("function");
      }
    });

    it("provides a logger", function () {
      expect(typeof Utils.LOG).toEqual("function");
    });

    it("creates a snapshot of an object on a special canvas", function () {
      var snapped = Utils.snapshot(canvasObject);

      expect(snapped.width).toEqual(canvasObject.width);
      expect(snapped.height).toEqual(canvasObject.height);
      expect(snapped.nodeName).toEqual("CANVAS");
    });

    it("extends and returns a new object from a prototype", function () {
      var proto = {
            type: "proto",
            describe: function () {
              return "I am " + this.type;
            }
          },
          extended = Utils.extend(proto, {
            type: "extended"
          });

      expect(extended.type).toEqual("extended");
      expect(extended.describe()).toEqual("I am extended");
    });

    it("updates saves, renders, and restores the context", function () {
      var canvas = Utils.snapshot(canvasObject),
          camera = {},
          method = function () {
          },
          efficientMethod,
          func;

      camera.context = canvas.getContext("2d");
      spyOn(camera.context, "save");
      spyOn(camera.context, "restore");
      efficientMethod = Utils.efficiently(method);
      efficientMethod.call(camera);

      expect(camera.context.save).toHaveBeenCalled();
      expect(camera.context.restore).toHaveBeenCalled();
    });

    it("infers an offset value from a canvas bounding box", function () {
      var canvas = Utils.snapshot(canvasObject),
          offset = Utils.getOffset(canvas);

      expect(typeof offset).toBe("number");
      expect(offset).toBeGreaterThan(-1);
    });

  });
});
