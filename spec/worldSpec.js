define(["world", "entities"], function (worldModule, entitiesModule) {
  "use strict";

  var World = worldModule.World,
      Actor = entitiesModule.Actor;

  describe("the World module", function () {
    it("provides the World prototype", function () {
      expect(World).toBeDefined();
    });
  });

  describe("the World prototype", function () {
    it("has a container object for actors", function () {
      var world = World.create(256, 256),
          actor = Actor.create();

      expect(world.actors).toBeDefined();
      world.actors.push(actor);
      expect(world.actors.length).toBeGreaterThan(0);
    });
  });
});
