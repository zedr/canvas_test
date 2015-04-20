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

    it("provides players that can render themselves", function () {
      var myPlayer = Entities.Player.create(),
          context = FakeContext.create();

      spyOn(context, "fillRect");
      myPlayer.render(context);

      // Players have a bounding box (rectangle).
      expect(context.fillRect).toHaveBeenCalled();
    });

    describe("the Actor prototype", function () {
      var myActor = Entities.Actor.create();

      it("is of type \"Actor\"", function () {
        expect(myActor.type).toEqual("Actor");
      });

      it("it has dimensions of zero or greater", function () {
        expect(myActor.dimensions.w).toBeGreaterThan(-1);
        expect(myActor.dimensions.h).toBeGreaterThan(-1);
      });

      it("its vector has a magnitude (speed) of zero or greater", function () {
        expect(myActor.speed).toBeGreaterThan(-1);
      });

      it("it has a position", function () {
        expect(myActor.position).toBeTruthy();
        expect(myActor.position.x).toBeDefined();
        expect(myActor.position.y).toBeDefined();
      });
    });
  });
});
