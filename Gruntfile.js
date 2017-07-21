module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist/'],
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        transform: [
          'brfs',
          ['babelify', {presets: ['es2015']}]
        ]
      },
      bundle: {
        files: [
          {
            'dist/js/viewer.js': ['js/viewer.js']
          },
          {
            'dist/js/worker.js': ['js/worker.js']
          }
        ]
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/js/viewer.min.js': ['dist/js/viewer.js'],
          'dist/js/worker.min.js': ['dist/js/worker.js']
        }
      }
    },
    copy: {
      fonts: {
        files: [
          {
            expand: true,
            src: ['fonts/**'],
            dest: 'dist/'
          }
        ]
      },
      html: {
        files: [
          {
            expand: true,
            cwd: 'html/',
            src: ['*'],
            dest: 'dist/'
          }
        ]
      },
      /*css: {
        files: [
          {
            expand: true,
            src: ['css/**'],
            dest: 'dist/'
          }
        ]
      },*/
      js: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/pdfjs-dist/build/',
            src: ['pdf.min.js', 'pdf.worker.min.js'],
            dest: 'dist/js/'
          }
        ]
      }
    },
    autoprefixer: {
      options: {
        browsers: ['ie 11', 'Safari >= 6']
      },
      css: {
        files: {
          'dist/css/viewer.css': 'css/viewer.css',
          'dist/css/print.css': 'css/print.css',
        }
      }
    }
  });
    
  // plugins
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // tasks
  grunt.registerTask('debug', ['clean', 'copy', 'autoprefixer', 'browserify']);
  grunt.registerTask('default', ['debug', 'uglify']);
};