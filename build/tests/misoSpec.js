(function( window, $, undefined ) {

describe("determine variable types", function() {
  it("'.isArray'", function() {
    expect($.isArray([])).toBe(true);
    expect($.isArray(document.links)).toBe(false);
    expect($.isArray(window)).toBe(false);
    expect($.isArray("")).toBe(false);
    expect($.isArray({})).toBe(false);
    expect($.isArray(true)).toBe(false);
  });

  it("'.isArrayLike'", function() {
    expect($.isArrayLike(document.links)).toBe(true);
    expect($.isArrayLike([])).toBe(false);
  });
});

})(window, Miso);
