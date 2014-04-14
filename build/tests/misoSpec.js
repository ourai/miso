(function( window, $, undefined ) {

function each( obj, callback ) {
  var idx = 0;
  var len = obj.length;
  var ele;
  var name;
  var value;

  if ( Array.isArray(obj) ) {
    while (idx < len) {
      ele = obj[idx];

      callback.apply(ele, [ele, idx++, obj]);
    }
  }
  else if ( typeof obj === "object" ) {
    for (name in obj) {
      value = obj[name];
      callback.apply(value, [value, name, obj]);
    }
  }
}

describe("determine variable types", function() {
  var vars = [[], document.links, window, "", {}, true, false, -1, 0, 1, 1.00000, 0.00001, "0"];
  var data = {
    isBoolean: [false, false, false, false, false, true, true, false, false, false, false, false, false],
    isArray: [true, false, false, false, false, false, false, false, false, false, false, false, false],
    isArrayLike: [false, true, false, false, false, false, false, false, false, false, false, false, false]
  };

  each(data, function( results, method ) {
    it("'." + method + "'", function() {
      each(vars, function( v, i ) {
        var r = results[i];
        // console.log(v, r);
        expect($[method](v)).toBe(r);
      });
    });
  });
});

})(window, Miso);
