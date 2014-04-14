(function( window, $ ) {

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
  var vars = [
      window, document.links, [], {}, {a:1, b:2},
      undefined, null, true, false, "true",
      "false", "", "0", "0.0000", "0.0001",
      "00.0001", "0.0100", "00.0100", -1, 0,
      1, 1.00000, 0.00001, function() {}, function() {alert(1)},
      new Date(), /\^[a-z]/
    ];
  var data = {
    // base types
    isBoolean: [
        false, false, false, false, false,
        false, false, true, true, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false
      ],
    isNumber: [
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, true, true,
        true, true, true, false, false,
        false, false
      ],
    isString: [
        false, false, false, false, false,
        false, false, false, false, true,
        true, true, true, true, true,
        true, true, true, false, false,
        false, false, false, false, false,
        false, false
      ],
    isFunction: [
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, true, true,
        false, false
      ],
    isArray: [
        false, false, true, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false
      ],
    isDate: [
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        true, false
      ],
    isRegExp: [
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, true
      ],
    isObject: [
        true, true, false, true, true,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false
      ],
    // extension types
    isArrayLike: [
        false, true, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false
      ]
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
