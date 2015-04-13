define("utils", ["window"], function (NS) {
  "use strict";

  var LOG;

  try {
    LOG = NS.console.log.bind(NS.console);
  } catch (err) {
    // Silence if the logger is not available.
    LOG = function (message) {
    };
  }

  function snapshot(entity) {
    var canvas = document.createElement("canvas"),
        context;

    canvas.width = entity.width;
    canvas.height = entity.height;
    context = canvas.getContext("2d");
    entity.render(context);
    return canvas;
  }

  function extend(entity, attributes) {
    var newEntity = Object.create(entity),
        attr;

    for (attr in attributes) {
      if (attributes.hasOwnProperty(attr)) {
        newEntity[attr] = attributes[attr];
      }
    }

    return newEntity;
  }

  function efficiently(callback) {
    return function () {
      this.context.save();
      callback();
      this.context.restore();
    };
  }

  function getOffset(canvas) {
    var box = canvas.getBoundingClientRect();

    // x for Firefox, left for Chrome
    return (box.x || box.left) * 1.5;
  }

  function handleClick(offset, event) {
    this.destination = {
      x: event.clientX - offset,
      y: event.clientY - offset
    };
  }

  // Export the module.
  return {
    snapshot: snapshot,
    extend: extend,
    efficiently: efficiently,
    getOffset: getOffset,
    handleClick: handleClick,
    LOG: LOG
  };

});
