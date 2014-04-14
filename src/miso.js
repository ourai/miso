"use strict";
var LIB_CONFIG, attach, batch, defineProp, hasOwnProp, settings, storage, toString, _H;

LIB_CONFIG = {
  name: "@NAME",
  version: "@VERSION"
};

toString = {}.toString;

settings = {
  validator: function() {}
};

storage = {
  types: {}
};


/*
 * 判断某个对象是否有自己的指定属性
 *
 * !!! 不能用 object.hasOwnProperty(prop) 这种方式，低版本 IE 不支持。
 *
 * @private
 * @method   hasOwnProp
 * @param    obj {Object}    Target object
 * @param    prop {String}   Property to be tested
 * @return   {Boolean}
 */

hasOwnProp = function(obj, prop) {
  if (obj == null) {
    return false;
  } else {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
};


/*
 * 为指定 object 或 function 定义属性
 *
 * @private
 * @method   defineProp
 * @param    target {Object}
 * @return   {Boolean}
 */

defineProp = function(target) {
  var error, prop, value;
  prop = "__" + (LIB_CONFIG.name.toLowerCase()) + "__";
  value = true;
  try {
    Object.defineProperty(target, prop, {
      __proto__: null,
      value: value
    });
  } catch (_error) {
    error = _error;
    target[prop] = value;
  }
  return true;
};


/*
 * 批量添加 method
 *
 * @private
 * @method  batch
 * @param   handlers {Object}   data of a method
 * @param   data {Object}       data of a module
 * @param   host {Object}       the host of methods to be added
 * @return
 */

batch = function(handlers, data, host) {
  var methods;
  methods = storage.methods;
  if (methods.isArray(data) || (methods.isPlainObject(data) && !methods.isArray(data.handlers))) {
    methods.each(data, function(d) {
      return batch(d != null ? d.handlers : void 0, d, host);
    });
  } else if (methods.isPlainObject(data) && methods.isArray(data.handlers)) {
    methods.each(handlers, function(info) {
      return attach(info, data, host);
    });
  }
  return host;
};


/*
 * 构造 method
 *
 * @private
 * @method  attach
 * @param   set {Object}        data of a method
 * @param   data {Object}       data of a module
 * @param   host {Object}       the host of methods to be added
 * @return
 */

attach = function(set, data, host) {
  var handler, method, methods, name, validator, validators, value, _i, _len;
  name = set.name;
  methods = storage.methods;
  if (!methods.isFunction(host[name])) {
    handler = set.handler;
    value = hasOwnProp(set, "value") ? set.value : data.value;
    validators = [set.validator, data.validator, settings.validator, function() {}];
    for (_i = 0, _len = validators.length; _i < _len; _i++) {
      validator = validators[_i];
      if (methods.isFunction(validator)) {
        break;
      }
    }
    method = function() {
      if (methods.isFunction(handler) && validator.apply(host, arguments) === true) {
        return handler.apply(host, arguments);
      } else {
        return value;
      }
    };
    host[name] = method;
  }
  return host;
};

storage.methods = {

  /*
   * 扩展指定对象
   * 
   * @method  mixin
   * @param   unspecified {Mixed}
   * @return  {Object}
   */
  mixin: function() {
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
  },

  /*
   * 遍历
   * 
   * @method  each
   * @param   object {Object/Array/Function}
   * @param   callback {Function}
   * @return  {Mixed}
   */
  each: function(object, callback) {
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
  },

  /*
   * 获取对象类型
   * 
   * @method  type
   * @param   object {Mixed}
   * @return  {String}
   */
  type: function(object) {
    if (object == null) {
      return String(object);
    } else {
      return storage.types[toString.call(object)] || "object";
    }
  },

  /*
   * 切割 Array-Like Object 片段
   *
   * @method   slice
   * @param    args {Array-Like}
   * @param    index {Integer}
   * @return
   */
  slice: function(args, index) {
    if (args == null) {
      return [];
    } else {
      return [].slice.call(args, Number(index) || 0);
    }
  },

  /*
   * 判断某个对象是否有自己的指定属性
   *
   * @method   hasProp
   * @return   {Boolean}
   */
  hasProp: function() {
    return hasOwnProp.apply(this, this.slice(arguments));
  },

  /*
   * 判断是否为 window 对象
   * 
   * @method  isWindow
   * @param   object {Mixed}
   * @return  {Boolean}
   */
  isWindow: function(object) {
    return object && this.isObject(object) && "setInterval" in object;
  },

  /*
   * 判断是否为 DOM 对象
   * 
   * @method  isElement
   * @param   object {Mixed}
   * @return  {Boolean}
   */
  isElement: function(object) {
    return object && this.isObject(object) && object.nodeType === 1;
  },

  /*
   * 判断是否为数字类型（字符串）
   * 
   * @method  isNumeric
   * @param   object {Mixed}
   * @return  {Boolean}
   */
  isNumeric: function(object) {
    return !isNaN(parseFloat(object)) && isFinite(object);
  },

  /*
   * Determine whether a number is an integer.
   *
   * @method  isInteger
   * @param   object {Mixed}
   * @return  {Boolean}
   */
  isInteger: function(object) {
    return this.isNumeric(object) && /^-?[1-9]\d*$/.test(object);
  },

  /*
   * 判断对象是否为纯粹的对象（由 {} 或 new Object 创建）
   * 
   * @method  isPlainObject
   * @param   object {Mixed}
   * @return  {Boolean}
   */
  isPlainObject: function(object) {
    var error, key;
    if (!object || !this.isObject(object) || object.nodeType || this.isWindow(object)) {
      return false;
    }
    try {
      if (object.constructor && !this.hasProp(object, "constructor") && !this.hasProp(object.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (_error) {
      error = _error;
      return false;
    }
    for (key in object) {
      key;
    }
    return key === void 0 || this.hasProp(object, key);
  },

  /*
   * Determin whether a variable is considered to be empty.
   *
   * A variable is considered empty if its value is or like:
   *  - null
   *  - undefined
   *  - false
   *  - ""
   *  - []
   *  - {}
   *  - 0
   *  - 0.0
   *  - "0"
   *  - "0.0"
   *
   * @method  isEmpty
   * @param   object {Mixed}
   * @return  {Boolean}
   *
   * refer: http://www.php.net/manual/en/function.empty.php
   */
  isEmpty: function(object) {
    var name, result;
    result = false;
    if ((object == null) || !object) {
      result = true;
    } else if (this.isObject(object)) {
      result = true;
      for (name in object) {
        result = false;
        break;
      }
    }
    return result;
  },

  /*
   * 是否为类数组对象
   *
   * @method  isArrayLike
   * @param   object {Mixed}
   * @return  {Boolean}
   */
  isArrayLike: function(object) {
    var length, result, type;
    result = false;
    if (this.isObject(object) && object !== null) {
      if (!this.isWindow(object)) {
        type = this.type(object);
        length = object.length;
        if (object.nodeType === 1 && length || this.isArray(type) || !this.isFunction(type) && (length === 0 || this.isNumber(length) && length > 0 && (length - 1) in object)) {
          result = true;
        }
      }
    }
    return result;
  }
};

storage.methods.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(name) {
  var lc;
  storage.types["[object " + name + "]"] = lc = name.toLowerCase();
  return storage.methods["is" + name] = function(target) {
    return this.type(target) === lc;
  };
});

_H = function(data, host) {
  return batch(data != null ? data.handlers : void 0, data, host != null ? host : {});
};

storage.methods.each(storage.methods, function(handler, name) {
  defineProp(handler);
  return _H[name] = handler;
});

window[LIB_CONFIG.name] = _H;
