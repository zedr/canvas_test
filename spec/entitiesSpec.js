define(["utils", "entities"], function (Utils, Entities) {
  "use strict";

  var moduleExports = [
        "Entity",
        "Actor",
        "Player"
      ],
      FakeContext = {
        fillRect: function () {
        },
        create: function () {
          return Object.create(this);
        }
      };

  describe("The Entities", function () {

    it("provides all the types of entities", function () {
      var proto;

      for (var idx = 0; idx < moduleExports.length; idx++) {
        proto = Entities[moduleExports[idx]];

        expect(proto).not.toBeUndefined();
        expect(typeof proto).toEqual("object");
      }
    });

    it("provides entities that have base methods", function () {
      var proto;

      for (var idx = 0; idx < moduleExports.length; idx++) {
        proto = Entities[moduleExports[idx]];

        expect(proto.create).not.toBeUndefined();
        expect(proto.render).not.toBeUndefined();
        expect(proto.describe).not.toBeUndefined();
      }
    });

    it("provides actors that have discrete dimensions and speed", function () {
      var myActor = Entities.Actor.create();

      expect(myActor.type).toEqual("Actor");
      expect(myActor.dimensions.w).toBeGreaterThan(-1);
      expect(myActor.dimensions.h).toBeGreaterThan(-1);
      expect(myActor.speed).toBeGreaterThan(-1);
    });

    it("provides players that can render themselves", function () {
      var player1 = Entities.Player.create(),
          context = FakeContext.create();

      spyOn(context, "fillRect");
      player1.render(context);

      expect(context.fillRect).toHaveBeenCalled();

    });

  });
});
