objectTypes()

LIB = ( data, host ) ->
  return batch data?.handlers, data, host ? {}

storage.methods.each storage.methods, ( handler, name )->
  # defineProp handler, "__#{META.name.toLowerCase()}__", true

  LIB[name] = handler

  return

LIB.mixin new Environment

defineProp LIB, "__meta__", META, true

window[META.name] = LIB
