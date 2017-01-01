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
		  {src: 'lib/returns.js', dest: 'dist/gs/returns.js'},
		  {src: 'lib/stats.js', dest: 'dist/gs/stats.js'},
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
		  {src: 'lib/returns.js', dest: 'lib/returns_dist.js'},
		  {src: 'lib/types.js', dest: 'lib/types_dist.js'},
		  {src: 'lib/stats.js', dest: 'lib/stats_dist.js'},
		]
      },
    },

	concat: {
	  options: {
	    separator: ';',
    	},
	  portfolio_analytics_dev: {
	    src: ['lib/drawdowns.js', 'lib/types.js', 'lib/returns.js', 'lib/stats.js'],
	    dest: 'dist/portfolio_analytics.dev.js',
	  },
	  portfolio_analytics_dist: {
	    src: ['lib/drawdowns_dist.js', 'lib/types_dist.js', 'lib/returns_dist.js', 'lib/stats_dist.js'],
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
  });
};