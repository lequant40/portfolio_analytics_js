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
		  { src: ['dist/portfolio_analytics.dist.js'], dest: 'dist/gs/portfolio_analytics.gs'}
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
		  { src: ['dist/portfolio_analytics.dist.js'], dest: 'dist/portfolio_analytics.dist.js'}
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
          { src: ['dist/gs/portfolio_analytics.gs'], dest: 'dist/gs/portfolio_analytics.gs'}
        ]
      }
    },
	
	concat: {
	  portfolio_analytics_dev: {
	    src: ['lib/header.js', 'lib/*/*.js', 'lib/footer.js'],
	    dest: 'dist/portfolio_analytics.dev.js',
	  },
	  portfolio_analytics_dist: {
	    src: ['lib/header.js', 'lib/*/*.js', 'lib/footer.js'],
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
      dev: ['test/*/*_dev.html'],
	  dist: ['test/*/*_dist.html']
    }

  });


  //
  grunt.registerTask('test', 'Tests the app.', function() {
	// Build the app in dev mode, and run all dev unit tests, 
	// which are a superset of dist unit tests
	grunt.task.run('concat:portfolio_analytics_dev');
	grunt.task.run('uglify:portfolio_analytics_dev');
	grunt.task.run('qunit:dev');
  });

  //
  grunt.registerTask('deliver', 'Builds the app into a distributable package.', function() {
    // Build the app in dist mode
	grunt.task.run('concat:portfolio_analytics_dist');
    grunt.task.run('strip_code:portfolio_analytics_dist');
	grunt.task.run('uglify:portfolio_analytics_dist');

	// Run the non-dev unit tests
	grunt.task.run('qunit:dist');	
  });
  
  //
  grunt.registerTask('deliver-gs', 'Builds the app into a distributable package for Google Sheets.', function() {
    // Starting from dist mode, remove header/footer
    grunt.task.run('deliver');
	grunt.task.run('strip_code:portfolio_analytics_gs');
	
	// Then change function definitions
	grunt.task.run('replace:portfolio_analytics_gs')
  });
};