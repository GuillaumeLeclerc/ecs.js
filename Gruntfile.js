module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
      babel: {
          options: {
              sourceMap: false,
              presets: ['stage-0', 'es2015']
          },
          dist: {
            files : [{
              expand: true,
              cwd: './engine',
              src: ['*.js'],
              dest: 'dist',
              ext: ".js"
            }]
          }
      }
  });

  grunt.registerTask('default', ['babel']);
}
