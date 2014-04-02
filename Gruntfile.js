module.exports = function( grunt ) {
  var pkg = grunt.file.readJSON("package.json");
  var info = {
      name: pkg.name.charAt(0).toUpperCase() + pkg.name.substring(1),
      version: pkg.version
    };
  var npmTasks = [
      "grunt-contrib-coffee",
      "grunt-contrib-uglify",
      "grunt-contrib-concat",
      "grunt-contrib-clean"
    ];
  var index = 0;
  var length = npmTasks.length;

  grunt.initConfig({
    pkg: pkg,
    meta: {
      src: "src",
      coffee: "src/coffee",
      js: "src/js",
      dest: "dest",
      build: "build",
      tests: "<%= meta.build %>/tests",
      tasks: "<%= meta.build %>/tasks"
    },
    concat: {
      coffee: {
        src: ["<%= meta.coffee %>/intro.coffee",
              "<%= meta.coffee %>/core.coffee",
              "<%= meta.coffee %>/outro.coffee"],
        dest: "<%= meta.dest %>/<%= pkg.name %>.coffee"
      },
      js: {
        options: {
          process: function( src, filepath ) {
            return src.replace(/@(NAME|VERSION)/g, function( text, key ) {
              return info[key.toLowerCase()];
            });
          }
        },
        src: ["<%= meta.js %>/intro.js",
              "<%= meta.js %>/<%= pkg.name %>.js",
              "<%= meta.js %>/outro.js"],
        dest: "<%= meta.dest %>/<%= pkg.name %>.js"
      }
    },
    coffee: {
      options: {
        bare: true,
        separator: "\x20"
      },
      build: {
        src: "<%= meta.dest %>/<%= pkg.name %>.coffee",
        dest: "<%= meta.js %>/<%= pkg.name %>.js"
      }
    },
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
      },
      build: {
        src: "<%= meta.dest %>/<%= pkg.name %>.js",
        dest: "<%= meta.dest %>/<%= pkg.name %>.min.js"
      }
    },
    clean: {
      compiled: {
        src: ["dest/*.coffee",
              "dest/*.scss",
              "!dest/_helpers.scss"]
      }
    },
    watch: {
      css: {
        files: ["<%= meta.dest %>/**/*.scss"],
        tasks: ["compass"]
      },
      html: {
        files: ["src/layouts/**/*.jade"],
        tasks: ["jade"]
      }
    }
  });

  for (; index < length; index++) {
    grunt.loadNpmTasks(npmTasks[index]);
  }

  // Tasks about CoffeeScript
  grunt.registerTask("compile_coffee", [
    "concat:coffee",
    "coffee",
    "concat:js",
    "uglify"]);
  // Default task
  grunt.registerTask("default", ["compile_coffee"]);
};
