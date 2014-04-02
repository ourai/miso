"use strict";
var BuiltIn, Constructor, LIB_CONFIG, NAMESPACE_EXP, attach, batch, builtin2core, namespace, settings, storage, toString, _H, _builtin;

LIB_CONFIG = {
  name: "@NAME",
  version: "@VERSION"
};

toString = Object.prototype.toString;

NAMESPACE_EXP = /^[0-9A-Z_.]+[^_.]?$/i;

settings = {
  validator: function() {}
};

storage = {
  core: {},
  types: {},
  modules: {
    Core: {
      BuiltIn: null
    }
  }
};


/*
 * 添加命名空间
 *
 * @private
 * @method  namespace
 * @param   ns_str {String}     a namespace format string (e.g. 'Module.Package')
 * @return  {Object}
 */

namespace = function(ns_str) {
  var obj;
  obj = null;
  if (_builtin.isString(ns_str) && NAMESPACE_EXP.test(ns_str)) {
    obj = storage.modules;
    _builtin.each(ns_str.split("."), function(part, idx) {
      if (obj[part] === void 0) {
        obj[part] = {};
      }
      return obj = obj[part];
    });
  }
  return obj;
};


/*
 * 批量添加 method
 *
 * @private
 * @method  batch
 * @param   host {Object}       the host of methods to be added
 * @param   handlers {Object}   data of a method
 * @param   data {Object}       data of a module
 * @param   isCore {Boolean}    whether copy to the core-method-object
 * @return
 */

batch = function(host, handlers, data, isCore) {
  var context;
  context = this;
  if (_builtin.isArray(data)) {
    _builtin.each(data, function(d) {
      return batch.apply(context, [(_builtin.isString(d[1]) && NAMESPACE_EXP.test(d[1]) ? namespace(d[1]) : host), d.handlers, d, isCore]);
    });
  } else if (_builtin.isObject(data)) {
    _builtin.each(handlers, function(info) {
      return attach.apply(context, [host, info, data, isCore]);
    });
  }
  return true;
};


/*
 * 构造 method
 *
 * @private
 * @method  attach
 * @param   host {Object}       the host of methods to be added
 * @param   set {Object}        data of a method
 * @param   data {Object}       data of a module
 * @param   isCore {Boolean}    whether copy to the core-method-object
 * @return
 */

attach = function(host, set, data, isCore) {
  var handler, inst, method, name, validator, validators, value, _i, _len;
  name = set.name;
  inst = this;
  if (!_builtin.isFunction(host[name])) {
    handler = set.handler;
    value = set.value === void 0 ? data.value : set.value;
    validators = [set.validator, data.validator, settings.validator, function() {}];
    for (_i = 0, _len = validators.length; _i < _len; _i++) {
      validator = validators[_i];
      if (_builtin.isFunction(validator)) {
        break;
      }
    }
    method = function() {
      if (validator.apply(inst, arguments) === true && _builtin.isFunction(handler)) {
        return handler.apply(inst, arguments);
      } else {
        return value;
      }
    };
    host[name] = method;
    if (isCore === true) {
      storage.core[name] = method;
      _builtin.mixin(inst, storage.core);
    } else {
      _builtin.mixin(inst, host);
    }
  }
  return true;
};

BuiltIn = (function() {
  function BuiltIn() {}


  /*
   * 扩展指定对象
   * 
   * @method  mixin
   * @param   unspecified {Mixed}
   * @return  {Object}
   */

  BuiltIn.prototype.mixin = function() {
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


  /*
   * 遍历
   * 
   * @method  each
   * @param   object {Object/Array/Function}
   * @param   callback {Function}
   * @return  {Mixed}
   */

  BuiltIn.prototype.each = function(object, callback) {
    var ele, index, name, type, value;
    type = this.type(object);
    if (type === "object" || type === "function") {
      for (name in object) {
        value = object[name];
        if (callback.apply(value, [value, name, object]) === false) {
          break;
        }
      }
    } else if (type === "array" || type === "string") {
      index = 0;
      while (index < object.length) {
        ele = type === "array" ? object[index] : object.charAt(index);
        if (callback.apply(object[index], [ele, index++, object]) === false) {
          break;
        }
      }
    }
    return object;
  };


  /*
   * 获取对象类型
   * 
   * @method  type
   * @param   object {Mixed}
   * @return  {String}
   */

  BuiltIn.prototype.type = function(object) {
    if (object == null) {
      return String(object);
    } else {
      return storage.types[toString.call(object)] || "object";
    }
  };

  return BuiltIn;

})();

_builtin = new BuiltIn;

builtin2core = function() {
  var name;
  for (name in _builtin) {
    storage.core[name] = _builtin[name];
  }
  return storage.modules.Core.BuiltIn = _builtin;
};

_builtin.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(name, i) {
  var lc;
  lc = name.toLowerCase();
  storage.types["[object " + name + "]"] = lc;
  name = "is" + name;
  return _builtin[name] = function(obj) {
    return this.type(obj) === lc;
  };
});

builtin2core();


/*
 * A constructor to batch constructing methods
 *
 * @class   Constructor
 * @constructor
 */

Constructor = (function() {
  function Constructor() {
    var args, data, isCore, module;
    this.constructor = Constructor;
    args = arguments;
    data = args[0];
    module = args[1];
    isCore = args[2];
    if (args.length === 2) {
      isCore = module;
    }
    batch.apply(this, [namespace(module), data.handlers, data, isCore === true]);
  }

  Constructor.prototype.toString = function() {
    return "[object " + LIB_CONFIG.name + "]";
  };

  Constructor.prototype.add = function(set) {
    return attach(set);
  };

  return Constructor;

})();

_builtin.mixin(Constructor, {
  toString: function() {
    return "function " + LIB_CONFIG.name + "() { [native code] }";
  },
  modules: storage.modules,
  config: function(setting) {
    return _builtin.mixin(settings, setting);
  }
});

_H = Constructor;

window[LIB_CONFIG.name] = _H;
