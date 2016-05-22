'use stric'
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-wiredep');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        wiredep: {
            target: {
                src: 'src/index.html' // point to your HTML file.
            }
        }
        
    })

};
