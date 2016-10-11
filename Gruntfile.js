module.exports = function(grunt) {
  var path = require('path');

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-strip-code');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	strip_code: {
      portfolio_analytics_gs: {
		options: {
			blocks: [
			{ start_block: "/* Start Not to be used as is in Google Sheets */",
			  end_block: "/* End Not to be used as is in Google Sheets */"
			}
			],
			pattern: /self\./g
		},
        files: [
		  {src: 'lib/drawdowns.js', dest: 'dist/gs/drawdowns.js'},
		  {src: 'lib/types.js', dest: 'dist/gs/types.js'},
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
		  {src: 'lib/drawdowns.js', dest: 'lib/drawdowns_dist.js'},
		]
      },
    },

	concat: {
	  options: {
	    separator: ';',
    	},
	  portfolio_analytics_dev: {
	    src: ['lib/drawdowns.js', 'lib/types.js'],
	    dest: 'dist/portfolio_analytics.dev.js',
	  },
	  portfolio_analytics_dist: {
	    src: ['lib/drawdowns_dist.js', 'lib/types.js'],
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
      all: ['test/**/*.html']
    }

  });

  //
  grunt.registerTask('test', 'Tests the app.', function() {
	// Minify the app in dev mode and run unit tests
	grunt.task.run('concat:portfolio_analytics_dev');
	grunt.task.run('uglify:portfolio_analytics_dev');
	grunt.task.run('qunit');
  });

  //
  grunt.registerTask('deliver', 'Builds the app into a distributable package.', function() {
    // Minify the app in dist mode (i.e., removing access to private methods...)
	grunt.task.run('concat:portfolio_analytics_dist');
	grunt.task.run('strip_code:portfolio_analytics_dist');
	grunt.task.run('uglify:portfolio_analytics_dist');
	
    // And generate the Google Spreadsheet version
	grunt.task.run('strip_code:portfolio_analytics_gs');
  });
  
  //
  grunt.registerTask('deliver_gs', 'Builds the Google Sheets app version.', function() {
    // Generate the Google Sheets version
	grunt.task.run('strip_code:portfolio_analytics_gs');
  });
};