module.exports = ( grunt ) ->
  pkg = grunt.file.readJSON "package.json"
  info =
    name: pkg.name.charAt(0).toUpperCase() + pkg.name.substring(1)
    version: pkg.version
  npmTasks = [
      "grunt-contrib-coffee"
      "grunt-contrib-uglify"
      "grunt-contrib-concat"
      "grunt-contrib-clean"
      "grunt-contrib-copy"
      "grunt-contrib-jasmine"
    ]

  grunt.initConfig
    repo: info
    pkg: pkg
    meta:
      temp: ".<%= pkg.name %>-cache"
    concat:
      coffee:
        options:
          process: ( src, filepath ) ->
            return src.replace /@(NAME|VERSION)/g, ( text, key ) ->
              return info[key.toLowerCase()]
        files:
          "<%= pkg.name %>.coffee": [
              "src/intro.coffee"
              "src/variables.coffee"
              "src/functions.coffee"
              "src/methods.coffee"
              "src/outro.coffee"
            ]
      js:
        files:
          "<%= meta.temp %>/<%= pkg.name %>-full.js": [
              "build/intro.js"
              "<%= meta.temp %>/<%= pkg.name %>.js"
              "build/outro.js"
            ]
    coffee:
      options:
        bare: true
        separator: "\x20"
      compile:
        src: "<%= pkg.name %>.coffee"
        dest: "<%= meta.temp %>/<%= pkg.name %>.js"
    uglify:
      options:
        banner: "/*!\n" +
                " * <%= repo.name %> v<%= repo.version %>\n" +
                " * <%= pkg.homepage %>\n" +
                " *\n" +
                " * Copyright Ourai Lin, http://ourai.ws/\n" +
                " *\n" +
                " * Date: <%= grunt.template.today('yyyy-mm-dd') %>\n" +
                " */\n"
        sourceMap: false
      compile:
        src: "<%= meta.temp %>/<%= pkg.name %>-full.js"
        dest: "<%= pkg.name %>.min.js"
    copy:
      test:
        expand: true
        cwd: "."
        src: ["**.js"]
        dest: "test"
    jasmine:
      test:
        src: "test/<%= pkg.name %>.min.js"
        options:
          version: "2.0.0"
          specs: "test/*Spec.js"

  grunt.loadNpmTasks task for task in npmTasks

  # Tasks about CoffeeScript
  grunt.registerTask "compile", [
      "concat:coffee"
      "coffee:compile"
      "concat:js"
      "uglify:compile"
    ]
  # Default task
  grunt.registerTask "default", [
      "compile"
      "copy"
    ]
