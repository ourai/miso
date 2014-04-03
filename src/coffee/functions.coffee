###
# 添加命名空间
#
# @private
# @method  namespace
# @param   ns_str {String}     a namespace format string (e.g. 'Module.Package')
# @return  {Object}
###
namespace = ( ns_str ) ->
  obj = null

  # Generate an object when the host variable is a namespace string.
  if _builtin.isString(ns_str) && NAMESPACE_EXP.test(ns_str)
      obj = storage.modules

      _builtin.each ns_str.split("."), ( part, idx ) ->
        obj[part] = {} if obj[part] is undefined

        obj = obj[part]

  return obj

###
# 批量添加 method
#
# @private
# @method  batch
# @param   host {Object}       the host of methods to be added
# @param   handlers {Object}   data of a method
# @param   data {Object}       data of a module
# @return
###
batch = ( host, handlers, data ) ->
  context = this

  if _builtin.isArray(data)
    _builtin.each data, ( d ) ->
      batch.apply context, [(if NAMESPACE_EXP.test(d[1]) then namespace(d[1]) else host), d[0]?.handlers, d[0]]
  else if _builtin.isObject(data)
    _builtin.each handlers, ( info ) ->
      attach.apply context, [host, info, data]

  return true

###
# 构造 method
#
# @private
# @method  attach
# @param   host {Object}       the host of methods to be added
# @param   set {Object}        data of a method
# @param   data {Object}       data of a module
# @param   isCore {Boolean}    whether copy to the core-method-object
# @return
###
attach = ( host, set, data ) ->
  name = set.name

  if not _builtin.isFunction host[name]
    handler = set.handler
    value = if hasOwn.call(set, "value") then set.value else data.value
    validators = [set.validator, data.validator, settings.validator, ->]

    break for validator in validators when _builtin.isFunction validator

    method = ->
      return if _builtin.isFunction(handler) is true and validator.apply(host, arguments) then handler.apply(host, arguments) else value;
    
    host[name] = method

  return true
