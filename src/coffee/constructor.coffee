###
# A constructor to construct methods
#
# @class   Constructor
# @constructor
###
class Constructor
  constructor: ->
    @constructor = Constructor
    @object = {}

    args = arguments
    # data of module's methods
    data = args[0]
    host = args[1]

    host = @object if args.length < 2 or not (typeof host in ["object", "function"])

    # Batch adding methods
    batch.apply this, [host, data?.handlers, data]

  toString: ->
    return "[object #{LIB_CONFIG.name}]"

  # Self-definition properties.
  add: ( set ) ->
    return attach set

# Properties of constructor
_builtin.mixin Constructor,
  # Reference of built-in object
  __builtIn__: _builtin

  # Override default properties.
  toString: ->
      return "function #{LIB_CONFIG.name}() { [native code] }"

  # Override global setting
  config: ( setting ) ->
    _builtin.mixin settings, setting

_H = Constructor
