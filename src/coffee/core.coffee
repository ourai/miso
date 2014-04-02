# Main objects
_H = {}

toString = Object.prototype.toString

storage =
  # map of object types
  types: {}

class _C
  mixin: ->
    args = arguments
    length = args.length
    target = args[0] ? {}
    i = 1

    # 只传一个参数时，扩展自身
    if length is 1
      target = this
      i--

    while i < length
      opts = args[i]

      if typeof opts is "object"
        for name, copy of opts
          # 阻止无限循环
          if copy is target
            continue

          if copy isnt undefined
            target[name] = copy

      i++

    return target

  type: ( object ) ->
    return if not object? then String(object) else storage.types[toString.call(object)] || "object"
