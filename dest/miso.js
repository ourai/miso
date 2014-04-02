"use strict";
var LIB_CONFIG, storage, toString, _C, _H;

LIB_CONFIG = {
  name: "Miso",
  version: "0.1.1"
};

_H = {};

toString = Object.prototype.toString;

storage = {
  types: {}
};

_C = (function() {
  function _C() {}

  _C.prototype.mixin = function() {
    var args, copy, i, length, name, opts, target, _ref;
    args = arguments;
    length = args.length;
    target = (_ref = args[0]) != null ? _ref : {};
    i = 1;
    if (length === 1) {
      target = this;
      i--;
    }
    while (i < length) {
      opts = args[i];
      if (typeof opts === "object") {
        for (name in opts) {
          copy = opts[name];
          if (copy === target) {
            continue;
          }
          if (copy !== void 0) {
            target[name] = copy;
          }
        }
      }
      i++;
    }
    return target;
  };

  _C.prototype.type = function(object) {
    if (object == null) {
      return String(object);
    } else {
      return storage.types[toString.call(object)] || "object";
    }
  };

  return _C;

})();

window[LIB_CONFIG.name] = _H;
