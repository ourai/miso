/*!
 * Construcotr
 * 
 * Developed by Ourai Lin, http://ourai.ws/
 * 
 * Copyright (c) 2013 JavaScript Revolution
 */
define(function( require, exports, module ) {

"use strict";

// Save a reference to some core methods.
var toString = Object.prototype.toString;

// Regular expressions
var NAMESPACE_EXP = /^[0-9A-Z_.]+[^_.]?$/i;

// default settings
var settings = {
        validator: function() {}
    };

// storage for internal usage
var storage = {
        core: {},       // copy of core methods
        types: {},      // map of object types
        modules: {
            Core: {
                BuiltIn: null
            }
        }
    };

// built-in methods
var func = {
        /**
         * 扩展指定对象
         * 
         * @method  mixin
         * @param   unspecified {Mixed}
         * @return  {Object}
         */
        mixin: function() {
            var args = arguments;
            var target = args[0] || {};
            var i = 1;

            // 只传一个参数时，扩展自身
            if ( args.length === 1 ) {
                target = this;
                i--;
            }

            for ( ; i < args.length; i++ ) {
                var opts = args[i];

                if ( typeof opts === "object" ) {
                    var name;

                    for ( name in opts ) {
                        var copy = opts[name];

                        // 阻止无限循环
                        if ( copy === target ) {
                            continue;
                        }

                        if ( copy !== undefined ) {
                            target[name] = copy;
                        }
                    }
                }
            }

            return target;
        },

        /**
         * 将其他组件组装到核心对象上
         * 
         * @method  absorb
         * @param   object {Object}
         * @return
         */
        // {
        //     name: "absorb",
        //     handler: function( object ) {
        //         if ( this.isArray(object) ) {
        //             var inst = new Constructor(this, object);
        //         }

        //         return this;
        //     }
        // },

        /**
         * 遍历
         * 
         * @method  each
         * @param   object {Object/Array/Function}
         * @param   callback {Function}
         * @return  {Mixed}
         */
        each: function ( object, callback ) {
            var type = this.type( object );
            var index = 0;
            var name;

            if ( type in { "object": true, "function": true } ) {
                for ( name in object ) {
                    if ( callback.apply( object[name], [ object[name], name, object ] ) === false ) {
                        break;
                    }
                }
            }
            else if ( type in { "array": true, "string": true } ) {
                var ele;

                for ( ; index < object.length; ) {
                    if ( type === "array" ) {
                        ele = object[index];
                    }
                    else {
                        ele = object.charAt(index);
                    }

                    if ( callback.apply( object[index], [ ele, index++, object ] ) === false ) {
                        break;
                    }
                }
            }

            return object;
        },

        /**
         * 获取对象类型
         * 
         * @method  type
         * @param   object {Mixed}
         * @return  {String}
         */
        type: function( object ) {
            return object == null ? String(object) : storage.types[ toString.call(object) ] || "object";
        }
    };

/**
 * A constructor to batch constructing methods
 *
 * @class   Constructor
 * @constructor
 */
function Constructor() {
    var args = arguments;
    var data = args[0];     // data of module's methods
    var module = args[1];   // module's namespace format string
    var isCore = args[2];   // whether copy to the core-method-object

    // When parameter's length is 2,
    // e.g., new Constructor([[data_1, module_1], [data_2, module_2], [data_n, module_n]], true)
    if ( args.length === 2 ) {
        isCore = module;
    }

    // Batch adding methods
    batch.apply(this, [namespace(module), data.handlers, data, (isCore === true ? true : false)]);
}

// Properties of constructor
func.mixin( Constructor, {
    /* Override default properties. */
    toString: function() {
        return "function " + this.name + "() { [native code] }";
    },

    /* Self-definition properties. */
    modules: storage.modules,
    // Override global setting
    config: function( setting ) {
        func.mixin(settings, setting);
    }
});

// Properties of instances
Constructor.prototype = {
    // Override default properties.
    constructor: Constructor,
    toString: function() {
        return "[object " + this.constructor.name + "]";
    },
    // Self-definition properties.
    add: function( set ) {
        return attach(set);
    }
};

// Fill the map object-types, and add methods to detect object-type.
func.each( "Boolean Number String Function Array Date RegExp Object".split(" "), function( name, i ) {
        var lc = name.toLowerCase();

        // populate the storage.types map
        storage.types["[object " + name + "]"] = lc;

        // add methods such as isNumber/isBoolean/...
        name = "is" + name;

        storage.core[name] = func[name] = function( obj ) {
            return this.type(obj) === lc;
        };
    }
);

builtin2core();

/**
 * 将内置方法附加到核心方法对象上
 *
 * @private
 * @method  builtin2core
 * @return
 */
function builtin2core() {
    var name;

    for ( name in func ) {
        storage.core[name] = func[name];
    }

    storage.modules.Core.BuiltIn = func;
}

/**
 * 添加命名空间
 *
 * @private
 * @method  namespace
 * @param   ns_str {String}     a namespace format string (e.g. 'Module.Package')
 * @return  {Object}
 */
function namespace( ns_str ) {
    var obj = null;

    // Generate an object when the host variable is a namespace string.
    if ( func.isString( ns_str ) && NAMESPACE_EXP.test( ns_str ) ) {
        obj = storage.modules;

        func.each( ns_str.split("."), function( part, idx ) {
            if ( obj[ part ] === undefined ) {
                obj[ part ] = {};
            }

            obj = obj[ part ];
        });
    }

    return obj;
}

/**
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
function batch( host, handlers, data, isCore ) {
    var context = this;

    if ( func.isArray(data) ) {
        func.each( data, function( d ) {
            batch.apply(context, [(func.isString(d[1]) && NAMESPACE_EXP.test(d[1]) ? namespace(d[1]) : host), d.handlers, d, isCore]);
        });
    }
    else if ( func.isObject(data) ) {
        func.each( handlers, function( info ) {
            attach.apply(context, [host, info, data, isCore]);
        });
    }
}

/**
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
function attach( host, set, data, isCore ) {
    var name = set.name;
    var inst = this;

    if ( !func.isFunction(host[name]) ) {
        var handler = set.handler;
        var value = set.value === undefined ? data.value : set.value;
        var validators = [set.validator, data.validator, settings.validator, function() {}];
        var validator;
        
        for ( var idx = 0; idx < validators.length; idx++ ) {
            validator = validators[idx];

            if ( func.isFunction(validator) ) {
                break;
            }
        }

        var method = function() {
            return validator.apply(inst, arguments) === true && func.isFunction(handler) ? handler.apply(inst, arguments) : value;
        };

        host[name] = method;

        if ( isCore === true ) {
            storage.core[name] = method;

            func.mixin(inst, storage.core)
        }
        else {
            func.mixin(inst, host)
        }
    }
}

module.exports = Constructor;

});
