define("entities", ["utils"], function (Utils) {
  "use strict";

  var Entity = {
        type: "Entity",
        render: function (context) {
        },
        describe: function () {
          return this.type;
        },
        create: function () {
          return Object.create(this);
        }
      },

      Actor = Utils.extend(Entity, {
        type: "Actor",
        position: {
          x: null,
          y: null
        },
        dimensions: {
          w: 0,
          h: 0
        },
        destination: null,
        speed: 0,
        describe: function () {
          var pos = this.position;

          return this.type + " (" + pos.x + ", " + pos.y + ")";
        }
      }),

      Player = Utils.extend(Actor, {
        type: "Player",
        dimensions: {
          w: 5,
          h: 5
        },
        speed: 2
      });

  Player.create = function (config) {
    var newPlayer = Object.create(this);

    newPlayer.name = (config) ? config.name : "Unnamed Player";

    Utils.LOG("Created a new player.");
    return newPlayer;
  };

  Player.render = function (context) {
    var pos = this.position,
        dim = this.dimensions;

    context.fillStyle = "rgb(255, 0, 0)";
    context.fillRect(pos.x, pos.y, dim.w, dim.h);
  };

  return {
    Entity: Entity,
    Actor: Actor,
    Player: Player
  };

});
