class Environment
  nav = navigator
  ua = nav.userAgent.toLowerCase()

  suffix =
    windows:
      "5.1": "XP"
      "5.2": "XP x64 Edition"
      "6.0": "Vista"
      "6.1": "7"
      "6.2": "8"
      "6.3": "8.1"

  platformName = ->
    name = /^[\w.\/]+ \(([^;]+?)[;)]/.exec(ua)[1].split(" ").shift()
    return if name is "compatible" then "windows" else name

  platformVersion = ->
    return (/windows nt ([\w.]+)/.exec(ua) or
            /os ([\w]+) like mac/.exec(ua) or
            /mac os(?: [a-z]*)? ([\w.]+)/.exec(ua) or
            [])[1]?.replace /_/g, "."

  detectPlatform = ->
    platform =
      touchable: false
      version: platformVersion()
    
    platform[platformName()] = true

    if platform.windows
      platform.version = suffix.windows[platform.version]
      platform.touchable = /trident[ \/][\w.]+; touch/.test ua
    else if platform.ipod or platform.iphone or platform.ipad
      platform.touchable = platform.ios = true

    return platform

  # jQuery 1.9.x 以下版本中 jQuery.browser 的实现方式
  # IE 只能检测 IE11 以下
  jQueryBrowser = ->
    browser = {}
    match = /(chrome)[ \/]([\w.]+)/.exec(ua) or
            /(webkit)[ \/]([\w.]+)/.exec(ua) or
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) or
            /(msie) ([\w.]+)/.exec(ua) or
            ua.indexOf("compatible") < 0 and /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) or
            []
    result =
      browser: match[1] or ""
      version: match[2] or "0"

    if result.browser
      browser[result.browser] = true
      browser.version = result.version

    if browser.chrome
      browser.webkit = true
    else if browser.webkit
      browser.safari = true

    return browser

  detectBrowser = ->
    # IE11 及以上
    match = /trident.*? rv:([\w.]+)/.exec(ua)

    if match
      browser =
        msie: true
        version: match[1]
    else
      browser = jQueryBrowser()

      if browser.mozilla
        browser.firefox = true
        match = /firefox[ \/]([\w.]+)/.exec(ua)
        browser.version = match[1] if match

    browser.language = nav.language or nav.browserLanguage

    return browser
     
  constructor: ->
    @platform = detectPlatform()
    @browser = detectBrowser()
