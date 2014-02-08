module.exports = ( grunt ) ->

    grunt.initConfig

        pkg : grunt.file.readJSON "package.json"

        meta :

            banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n ' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n *\\n " : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>>;\n' +
            ' * Licensed under the <%= _.pluck(pkg.licenses, "type").join(", ") %> license */\n\n'

        #  Remove old build.
        #
        clean :

            dist :

                src : [ "dist" ]

        #  Copy the images and the index to the dist location.
        #
        copy :

            dist :

                files : [
                    { expand: true, cwd: "src", src: "images/**/*", dest: "dist/src" }
                ,   { expand: true, cwd: "src", src: "css/**/*",  dest: "dist/src" }
                ,   { expand: true, cwd: "node_modules/baijs", src: "css/**/*",  dest: "dist/src" }
                ,   { expand: true, cwd: "node_modules/baijs", src: "js/**/*",  dest: "dist/src" }
                ,   { expand: true, cwd: "src", src: "js/**/*",  dest: "dist/src" }
                ,   { expand: true, cwd: "src", src: "index.html",  dest: "dist/src" }
                ]

            examples :

                files : [
                    { expand: true, cwd: "src", src: "examples/**/*",  dest: "dist/src/" }
                ,   { expand: true, cwd: "dist/src/js", src: "jquery.<%= pkg.name %>*",  dest: "dist/src/examples/scrollbarInfinite/js" }
                ,   { expand: true, cwd: "dist/src/js", src: "jquery.<%= pkg.name %>*",  dest: "dist/src/examples/scrollbarSimple/js" }
                ]


        #  Validate javascript files with jsHint.
        #
        jshint :

            options :

                jshintrc : ".jshintrc"

            all : [
                "src/js/jquery.<%= pkg.name %>.js"
            ]

        #  Minify the javascript.
        #
        uglify :

            dist :

                options :

                    banner   : "<%= meta.banner %>"
                    beautify : false

                files :

                        "dist/src/js/jquery.<%= pkg.name %>.min.js" : ["dist/src/js/jquery.<%= pkg.name %>.js"]


        #  Replace image file paths in css and correct css path in the index.
        #
        replace :

            dist :
                src : [
                    "dist/src/index.html"
                    "dist/src/examples/**/*.html"
                ]
                overwrite     : true
                replacements  : [
                    {
                        from : /@@bnr@@/ig
                    ,   to   : "<%= pkg.version %>"
                    }
                ,   {
                        from : /..\/node_modules\/baijs\//ig
                    ,   to   : ""
                    }
                ,   {
                        from : /..\/..\/js\/js/ig
                    ,   to   : ""
                    }
                ]

        # Make a zipfile.
        #
        compress :

            dist :

                options :

                    archive: "dist/dist-<%= pkg.version %>.zip"

                expand : true
                cwd    : "dist/src"
                src    : ["**/*"]
                dest   : "."

            examples :

                options :

                    archive: "dist/src/<%= pkg.name %>-<%= pkg.version %>.zip"

                expand : true
                cwd    : "dist/src/examples"
                src    : ["**/*"]
                dest   : "."

        "ftp-deploy":

            dist:

                auth:

                    host    : "ftp.baijs.nl"
                    port    : 21
                    authKey : "<%= pkg.name %>"

                src: "dist/src"
                dest: "/"

    #  Load all the task modules we need.
    #
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-text-replace"
    grunt.loadNpmTasks "grunt-contrib-compress"
    grunt.loadNpmTasks "grunt-ftp-deploy"
    grunt.loadNpmTasks "grunt-contrib-jshint"

    #  Distribution build
    #
    grunt.registerTask(

        "default"
    ,   [
            "jshint"
            "clean:dist"
            "copy:dist"
            "uglify:dist"
            "compress:dist"
            "replace:dist"
            "copy:examples"
            "compress:examples"
        ]
    )

    #  Upload dist to baijs.nl
    #
    grunt.registerTask(

        "ftp"
    ,   [
            "default"
            "ftp-deploy:dist"
        ]
    )