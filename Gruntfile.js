module.exports = function(grunt) {
  var path = require('path');

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-strip-code');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-replace');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	strip_code: {
      portfolio_analytics_gs: {
		options: {
			blocks: [
			{ start_block: "/* Start Not to be used as is in Google Sheets */",
			  end_block: "/* End Not to be used as is in Google Sheets */"
			}
			]
		},
        files: [
		  { expand: true, flatten: true, src: ['lib/**/*.js'], dest: 'dist/gs/'}
		]
      },
      portfolio_analytics_dist: {
		options: {
			blocks: [
			{ start_block: "/* Start Wrapper private methods - Unit tests usage only */",
			  end_block: "/* End Wrapper private methods - Unit tests usage only */"
			}
			]
		},
        files: [
		  { expand: true, flatten: true, src: ['lib/**/*.js'], dest: 'build/'}
		]
      },
    },

    replace: {
      portfolio_analytics_gs: {
        options: {
		  preserveOrder: true,
          patterns: [
            {
              match: /self\.(\w+)\s=\sfunction/g,
              replacement: 'function $1'
            },
            {
              match: /self\./g,
              replacement: ''
            }			
          ]
        },
        files: [
          { expand: true, flatten: true, src: ['dist/gs/*.js'], dest: 'dist/gs/'}
        ]
      }
    },
	
	concat: {
	  options: {
	    separator: ';',
    	},
	  portfolio_analytics_dev: {
	    src: ['lib/**/*.js'],
	    dest: 'dist/portfolio_analytics.dev.js',
	  },
	  portfolio_analytics_dist: {
	    src: ['build/**/*.js'],
	    dest: 'dist/portfolio_analytics.dist.js',
	  },
	},
  
    uglify: {
	  options: {
	    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> (<%= pkg.date %>), <%= pkg.author %> */'
      },
      portfolio_analytics_dev: {
        files: {
          'dist/portfolio_analytics.dev.min.js': ['dist/portfolio_analytics.dev.js']
        }
      },
      portfolio_analytics_dist: {
        files: {
          'dist/portfolio_analytics.dist.min.js': ['dist/portfolio_analytics.dist.js']
        }
      }	  
    },
	
	qunit: { 
      dev: ['test/**/*_dev.html'],
	  dist: ['test/**/*_dist.html']
    }

  });


  //
  grunt.registerTask('test', 'Tests the app.', function() {
	// Minify the app in dev mode and run all unit tests
	grunt.task.run('concat:portfolio_analytics_dev');
	grunt.task.run('uglify:portfolio_analytics_dev');
	grunt.task.run('qunit:dev');
  });

  //
  grunt.registerTask('deliver', 'Builds the app into a distributable package.', function() {
    // Minify the app in dist mode (i.e., removing access to private methods...)
    grunt.task.run('strip_code:portfolio_analytics_dist');
	grunt.task.run('concat:portfolio_analytics_dist');
	grunt.task.run('uglify:portfolio_analytics_dist');
	
	// Run the non-dev unit tests
	grunt.task.run('qunit:dist');
	
    // And generate the Google Spreadsheet version
	grunt.task.run('strip_code:portfolio_analytics_gs');
	grunt.task.run('replace:portfolio_analytics_gs');
  });
};