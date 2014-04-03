# Save a reference to some core methods.
toString = {}.toString
hasOwn = {}.hasOwnProperty

# Regular expressions
NAMESPACE_EXP = /^[0-9A-Z_.]+[^_.]?$/i

# default settings
settings =
  validator: ->

# storage for internal usage
storage =
  # copy of core methods
  core: {}
  # map of object types
  types: {}
  modules:
    Core:
      BuiltIn: null
