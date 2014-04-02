###
# A constructor to batch constructing methods
#
# @class   Constructor
# @constructor
###
class Constructor
  constructor: ->
    @constructor = Constructor

    args = arguments
    data = args[0]     # data of module's methods
    module = args[1]   # module's namespace format string
    isCore = args[2]   # whether copy to the core-method-object

    # When parameter's length is 2,
    # e.g., new Constructor([[data_1, module_1], [data_2, module_2], [data_n, module_n]], true)
    isCore = module if args.length is 2

    # Batch adding methods
    batch.apply this, [namespace(module), data.handlers, data, isCore is true]

  toString: ->
    return "[object #{LIB_CONFIG.name}]"

  # Self-definition properties.
  add: ( set ) ->
    return attach set

# Properties of constructor
_builtin.mixin Constructor,
  # Override default properties.
  toString: ->
      return "function #{LIB_CONFIG.name}() { [native code] }";
  # Self-definition properties.
  modules: storage.modules
  # Override global setting
  config: ( setting ) ->
    _builtin.mixin settings, setting

_H = Constructor
