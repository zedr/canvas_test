define(["utils"], function (Utils) {
  "use strict";

  describe("The Utilities", function () {
    var functionNames = ["snapshot"];

    it("provides all the utility functions on the App namespace", function () {
      for (var idx = 0; idx < functionNames.length; idx++) {
        expect(typeof Utils[functionNames[idx]]).toEqual("function");
      }
    });

    it("provides a logger", function () {
      expect(typeof Utils.LOG).toEqual("function");
    });

    it("creates a snapshot of an object on a dedicated canvas", function () {
      var canvasObject = {
            width: 50,
            height: 50,
            render: function (context) {
              context.fillStyle = "rgb(0, 128, 32)";
              context.fillText("tested", 0, 0);
            }
          },
          snapped = Utils.snapshot(canvasObject);

      expect(snapped.width).toEqual(canvasObject.width);
      expect(snapped.height).toEqual(canvasObject.height);
      expect(snapped.nodeName).toEqual("CANVAS");
    });
  });
});
