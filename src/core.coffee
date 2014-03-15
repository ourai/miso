"use strict"

# Config of library
LIB_CONFIG =
  name: "@NAME"
  version: "@VERSION"

toString = Object.prototype.toString

NAMESPACE_EXP = /^[0-9A-Z_.]+[^_.]?$/i

settings =
  validator: ->

storage = 
  core: {}
  types: {}
  modules:
    Core:
      BuiltIn: null
