require("../utils.js");

describe("The Utilities", function() {

  it("provides an App namespace", function () {
    expect(this.App).not.toBeUndefined();
  });

  it("provides all the utility functions on the App namespace", function() {
    for (var name in ["snapshot"]) {
      expect(typeof App[name]).toEqual("function");
    }
  });
});
