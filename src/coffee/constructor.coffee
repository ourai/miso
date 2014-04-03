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

    # data of module's methods
    data = arguments[0]

    # Batch adding methods
    batch.apply this, [@object, data?.handlers, data]

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
