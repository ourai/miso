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
# @param   isCore {Boolean}    whether copy to the core-method-object
# @return
###
batch = ( host, handlers, data, isCore ) ->
  context = this

  if _builtin.isArray(data)
    _builtin.each data, ( d ) ->
      batch.apply context, [(if _builtin.isString(d[1]) and NAMESPACE_EXP.test(d[1]) then namespace(d[1]) else host), d.handlers, d, isCore]
  else if _builtin.isObject(data)
    _builtin.each handlers, ( info ) ->
      attach.apply context, [host, info, data, isCore]

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
attach = ( host, set, data, isCore ) ->
  name = set.name
  inst = this

  if not _builtin.isFunction host[name]
    handler = set.handler
    value = if set.value is undefined then data.value else set.value
    validators = [set.validator, data.validator, settings.validator, ->]

    break for validator in validators when _builtin.isFunction validator

    method = ->
      return if validator.apply(inst, arguments) is true and _builtin.isFunction(handler) then handler.apply(inst, arguments) else value;
    
    host[name] = method

    if isCore is true
      storage.core[name] = method
      _builtin.mixin inst, storage.core
    else
      _builtin.mixin inst, host

  return true
