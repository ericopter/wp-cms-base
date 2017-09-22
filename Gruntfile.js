module.exports = function(grunt) {
    // Project configuration.
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            default: {
                src: [
                    'js/jquery.easing.js',
                    'includes/scripts/flexslider/jquery.flexslider-min.js',
                    // 'includes/scripts/isotope/jquery.isotope.min.js',
                    // 'includes/scripts/superfish/js/hoverIntent.js',
                    // 'includes/scripts/superfish/js/superfish.js',
                    // 'includes/scripts/superfish/js/superclick.js',
                    // 'includes/scripts/shadowbox/shadowbox.js',
                    // 'includes/scripts/ewd/ewdGallery.js',
                    'includes/scripts/ewd/project.js',
                    'js/general.js'
                ],
                dest: 'js/build.js'
            }
        },

        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          },
          build: {
            src: [
                'js/build.js'
            ],
            dest: 'js/build.min.js'
          }
        },

        less: {
            build: {
                options: {
                    paths: ['less']
                },
                files: {
                    'css/build.css' : 'less/build.less',
                    'css/responsive.css' : 'less/grid-responsive.less'
                }
            },
            compress: {
                options: {
                    paths: ['less'],
                    compress: true,
                    sourceMap: true
                },
                files: {
                    'css/build.min.css' : 'less/build.less',
                    'css/responsive.min.css' : 'less/grid-responsive.less'
                }
            }
        },

        watch: {
            styles: {
                files: ['less/*.less'],
                tasks: ['less']
            },
            scripts: {
                files: ['js/general.js'],
                tasks: ['concat', 'uglify']
            }
        }
      });

      // Load the plugin that provides the "uglify" task.
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-contrib-less');

      // Default task(s).
      grunt.registerTask('build', ['less', 'concat', 'uglify']);
      grunt.registerTask('default', ['build', 'watch']);
};