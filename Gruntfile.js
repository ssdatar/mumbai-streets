module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      target: {
        files: [
          {
            expand: true,
            src: ['bower/jquery/dist/jquery.min.js'],
            dest: 'build/assets/js/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            src: ['bower/d3/d3.min.js'],
            dest: 'build/scripts/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          {
            expand: true,
            src: ['bower/topojson/topojson.min.js'],
            dest: 'build/scripts/lib/',
            rename: function (dest, src) {
              return dest + src.substring(src.lastIndexOf('/')).replace('.min','');
            }
          },
          { expand: true, flatten: true, src: ['src/data/*'], dest: 'build/data/' },
          { expand: true, flatten: true, src: ['src/images/*'], dest: 'build/images/' },
          { expand: true, flatten: true, src: ['src/style/lib/foundation.css'], dest: 'build/style/lib/' }
        ]
      }
    },

    jshint: {
      files: [
        'src/scripts/*.js'
      ],
      options: {
        browser: true,
        curly: true,
        eqeqeq: true,
        latedef: true,
        undef: true,
        unused: true,
        trailing: true,
        smarttabs: true,
        indent: 2,
        globals: {
          jQuery: true,
          $: true,
          _: true
        }
      }
    },

    uglify: {
      options: {
        mangle: { except: ['d3', '_','$'] },
        compress: {},
      },
      my_target: {
        files: {
          'build/scripts/main.js'   : ['src/scripts/main.js']
        }
      }
    },

    htmlmin: {
      build: {
        options: {
          removeComments: false,
          collapsWhitespace: true,
          useShortDoctype: true
        },
        files: {
          'build/index.html'    : 'src/index.html'
        }
      }
    },

    cssmin: {
      compress: {
        files: {
          'build/style/app.css'       : ['src/style/app.css']
        }
      }
    },

    imagemin: {
      jpg: {
        options: { progressive: true },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.jpg"],
          dest: "build/images"
        }]
      },
      png: {
        options: { optimizationLevel: 3 },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.png"],
          dest: "build/images"
        }]
      },
      gif: {
        options: { interlaced: true },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.gif"],
          dest: "build/images"
        }]
      },
      svg: {
        options: {
          removeViewBox: false,
          removeEmptyAttrs: false
        },
        files: [{
          expand: true,
          cwd: "src/images",
          src: ["*.svg"],
          dest: "build/images"
        }]
      }
    },
    
    s3: {
      options: {
        accessKeyId: "<%= aws.key %>",
        secretAccessKey: "<%= aws.secret %>",
        bucket: "<%= aws.bucket %>",
        access: "public-read",
        gzip: true,
        cache: false
      },
      build: {
        cwd: "build/",
        src: "**",
        dest: 'georgia-presidential-elections/'
      }
    },

    bowercopy: {
      options: {
        // clean: true,
        runBower: true,
        report: true
      },
      // test: {
      //   options: {
      //     destPrefix: 'test'
      //   },
      //   files: {
      //     "boot.js": "jasmine/lib/jasmine-core/boot.js",
      //     "console.js": "jasmine/lib/console/console.js",
      //     "jasmine-html.js": "jasmine/lib/jasmine-core/jasmine-html.js",
      //     "jasmine.css": "jasmine/lib/jasmine-core/jasmine.css",
      //     "jasmine.js": "jasmine/lib/jasmine-core/jasmine.js",
      //     "jasmine_favicon.png": "jasmine/images/jasmine_favicon.png",
      //     "sinon.js": "sinon/lib/sinon.js"
      //   }
      // },
      lib_scripts: {
        options: {
          destPrefix: 'src/scripts/lib'
        },
        files: {
          // "foundation.core.js": "foundation-sites/dist/plugins/foundation.core.js",
          // "foundation.responsiveToggle.js": "foundation-sites/dist/plugins/foundation.responsiveToggle.js",
          // "foundation.util.mediaQuery.js": "foundation-sites/dist/plugins/foundation.util.mediaQuery.js",
          "leaflet.js":"leaflet/dist/leaflet.js",
          "topojson.js":"topojson/topojson.min.js",
          "underscore.js": "underscore/underscore-min.js",
          "jquery.js": "jquery/dist/jquery.js",
        }
      },
      lib_styles: {
        options: {
          destPrefix: 'src/style/lib'
        },
        files: {
          "foundation.css": "foundation-sites/dist/foundation.min.css",
          "leaflet.css": "leaflet/dist/leaflet.css",
          "images": "leaflet/dist/images"
        }
      }
    },

    express: {
      dev: {
        options: {
          hostname: '*',
          port: 3000,
          bases: 'src',
          livereload: true,
          showStack: true
        }
      },
      test: {
        options: {
          hostname: '*',
          port: 8081,
          bases: '.',
          livereload: true
        }
      },
      build: {
        options: {
          hostname: '*',
          port: 4000,
          bases: 'build',
          livereload: true,
          showStack: true
        }
      }
    },

    open: {
      dev: {
        path: 'http://localhost:<%= express.dev.options.port %>',
        app: "Google Chrome"
      },
      test: {
        path: 'http://localhost:<%= express.test.options.port %>/SpecRunner.html'
      },
      build: {
        path: 'http://localhost:<%= express.build.options.port %>',
        app: "Google Chrome"
      }
    },

    watch: {
      dev: {
        files: ['src/index.html','src/scripts/*.js','src/scripts/*.js','src/style/**/*.css'],
        options: {
          livereload: true
        }
      },
      test: {
        files: ['src/index.html','src/scripts/*.js','spec/*.js'],
        options: {
          livereload: true
        }
      }
    },

    clean: {
      options: {
         'no-write': false
       },
       build: ['build/*']
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['bowercopy','copy','uglify','cssmin','processhtml','htmlmin','s3']);
  grunt.registerTask('build', ['clean','bowercopy','copy', 'uglify','cssmin','htmlmin']);
  grunt.registerTask('deploy', ['s3']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('server', ['express:dev','open:dev','watch:dev','express-keepalive']);
  grunt.registerTask('server:test', ['express:test','open:test','watch:test','express-keepalive']);
  grunt.registerTask('server:build', ['express:build', 'open:build','express-keepalive']);
};