class BuiltIn
  ###
  # 扩展指定对象
  # 
  # @method  mixin
  # @param   unspecified {Mixed}
  # @return  {Object}
  ###
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

  ###
  # 遍历
  # 
  # @method  each
  # @param   object {Object/Array/Function}
  # @param   callback {Function}
  # @return  {Mixed}
  ###
  each: ( object, callback ) ->
    type = @type object

    if type in ["object", "function"]
      break for name, value of object when callback.apply(value, [value, name, object]) is false
    else if type in ["array", "string"]
      index = 0
      
      while index < object.length
        ele = if type is "array" then object[index] else object.charAt index

        if callback.apply(object[index], [ele, index++, object]) is false
          break

    return object;

  ###
  # 获取对象类型
  # 
  # @method  type
  # @param   object {Mixed}
  # @return  {String}
  ###
  type: ( object ) ->
    return if not object? then String(object) else storage.types[toString.call(object)] || "object"

  ###
  # 切割 Array-Like Object 片段
  #
  # @method   slice
  # @param    args {Array-Like}
  # @param    index {Integer}
  # @return
  ###
  slice: ( args, index ) ->
    return [].slice.call args, (Number(index) || 0)

  ###
  # 判断某个对象是否有自己的指定属性
  #
  # @method   hasProp
  # @return   {Boolean}
  ###
  hasProp: ->
    return hasOwnProp.apply this, @slice arguments

_builtin = new BuiltIn

# Fill the map object-types, and add methods to detect object-type.
_builtin.each "Boolean Number String Function Array Date RegExp Object".split(" "), ( name, i ) ->
  # populate the storage.types map
  storage.types["[object #{name}]"] = lc = name.toLowerCase()

  # add methods such as isNumber/isBoolean/...
  _builtin["is#{name}"] = ( target ) ->
    return @type(target) is lc
